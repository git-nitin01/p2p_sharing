package org.sharing;

import com.sun.net.httpserver.HttpServer;

import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class FileController {
    private final HttpServer server;
    private static String uploadDir = null;
    private final ExecutorService executorService;

    public FileController(int port) throws IOException {
        this.server =  HttpServer.create(new InetSocketAddress(port), 0);
        uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
        this.executorService = Executors.newFixedThreadPool(10);

        File uploadDirFile = new File(uploadDir);
        if(!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
        }

        server.createContext("/upload", new UploadHandler());
        server.createContext("/resolve", new ResolveHandler());

        server.setExecutor(executorService);
    }

    public static String getUploadDir() throws NullPointerException {
        if(uploadDir != null) {
            return uploadDir;
        } else {
            throw new NullPointerException();
        }
    }

    public void startServer() {
        this.server.start();
        System.out.println("Server started listening on port " + server.getAddress().getPort());
    }

    public void stopServer() {
        System.out.println("Stopping server in 3 secs!");
        this.server.stop(3000);
        System.out.println("Server stopped successfully!");
    }

    public static String toJson(Map<String, String> response) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        for(Map.Entry<String, String> entry: response.entrySet()) {
            sb.append(String.format("\"%s\": \"%s\",", entry.getKey(), entry.getValue()));
        }
        if (!response.isEmpty()) {
            sb.deleteCharAt(sb.length() - 1);
        }
        sb.append("}");
        return sb.toString();
    }
}
