package org.sharing;


import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

public class FileStreamer {
    public record StreamResult(String code, int port) {};
//    store code to port mappings in memory, only one instance
    private static final ConcurrentHashMap<String, ShareSession> sessions = new ConcurrentHashMap<>();

//    start streaming file as soon request received from upload handler
//    create a new long-lived thread
    public static StreamResult start(File file) throws IOException{
        String code = generateShareCode();

//        open a server on a free port and save the mapping
        ServerSocket socket = new ServerSocket(0);
        int port = socket.getLocalPort();

        ShareSession session = new ShareSession(code, file, socket);
        sessions.put(code, session);
//        start streaming
        new Thread(() -> {
            try (socket) {
                Socket client = socket.accept();
                System.out.println("Client connected: " + client.getInetAddress());
                try(
                        FileInputStream fis = new FileInputStream(file);
                        OutputStream os = client.getOutputStream();
                        PrintWriter pw = new PrintWriter(os, true);
                        ){
                    pw.println("HTTP/1.1 200 OK");
                    pw.println("Content-Type: application/octet-stream");
                    pw.println("Content-Disposition: attachment; filename=\"" + file.getName() + "\"");
                    pw.println("Content-Length: " + file.length());
                    pw.println();
                    pw.flush();


                    byte[] chunk = new byte[8192];
                    int bytesRead;
                    while((bytesRead = fis.read(chunk)) != -1) {
                        os.write(chunk, 0, bytesRead);
                    }
                    os.flush();
                    fis.close();

                    file.delete();
                    sessions.remove(code);
                    System.out.println("File sent and session cleaned: " + code);
                }
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }).start();

        return new StreamResult(code, port);
    }

    public static String getFileName(String code) {
        ShareSession session = sessions.get(code);
        return session.file.getName();
    }

    public static String generateShareCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        Random rand = new Random();
        for(int i=0; i<6; i++) {
            code.append(chars.charAt(rand.nextInt(chars.length())));
        }
        return code.toString();
    }

    public static Integer getPort(String code) {
        ShareSession session = sessions.get(code);
        return session != null ? session.socket.getLocalPort() : null;
    }

//    start cleaner service
    static {
        startCleanup();
    }

//    cleaner service, global service to check for all stale files
    private static void startCleanup() {
        Thread cleaner = new Thread(() -> {
            while(true) {
                try {
                    Thread.sleep(60 * 60 * 1000); // check after every hour
                    for(Map.Entry<String, ShareSession> entry: sessions.entrySet()) {
                        ShareSession session = entry.getValue();
                        if(session.isExpired()) {
                            try {
                                session.socket.close();
                            } catch (IOException ignored) {
                                session.file.delete();
                                sessions.remove(entry.getKey());
                                System.out.println("Expired session cleaned: "+session.code);
                            }
                        }
                    }
                } catch (InterruptedException ex) {}
            }
        });
        cleaner.setDaemon(true);
        cleaner.start();
    }

    public static class ShareSession {
        public final String code;
        public final File file;
        public final ServerSocket socket;
        public final long createdAt;

        public ShareSession(String code, File file, ServerSocket socket) {
            this.code = code;
            this.file = file;
            this.socket = socket;
            this.createdAt = System.currentTimeMillis();
        }

        public boolean isExpired() {
            long now = System.currentTimeMillis();
            return (now - createdAt) >= 24 * 60 * 60 * 1000; // 24 hrs expiry;
        }
    }
}

