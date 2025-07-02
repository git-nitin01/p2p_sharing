package org.sharing;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.net.URI;

public class ProxyDownloader implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        Headers headers = exchange.getResponseHeaders();
        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type");
        headers.add("Access-Control-Allow-Credentials", "true");

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1); // No content
            exchange.close();
            return;
        }

        if (exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            URI uri = exchange.getRequestURI();
            String queryParam = uri.getQuery();

            String code = null;

            if (queryParam != null && queryParam.startsWith("code=")) {
                code = queryParam.substring(5);
            }

            if (code == null || code.isEmpty()) {
                exchange.sendResponseHeaders(400, -1); // Bad request
                return;
            }


            Integer port = FileStreamer.getPort(code);
            String filename = FileStreamer.getFileName(code);

            System.out.println(code);
            System.out.println(port);
            System.out.println(filename);

            // Read full file content from socket into memory
            ByteArrayOutputStream bufferStream = new ByteArrayOutputStream();
            try (
                    Socket socket = new Socket("localhost", port);
                    InputStream is = socket.getInputStream()
            ) {
                byte[] buffer = new byte[8192];
                int len;
                while ((len = is.read(buffer)) != -1) {
                    bufferStream.write(buffer, 0, len);
                }
            } catch (IOException e) {
                System.err.println("Error reading from P2P socket: " + e.getMessage());
                exchange.sendResponseHeaders(500, -1);
                return;
            }

            byte[] fileBytes = bufferStream.toByteArray();

            // Send response to client (now it's a simple write)
            exchange.getResponseHeaders().add("Content-Disposition", String.format("attachment; filename=\"%s\"", filename));
            exchange.sendResponseHeaders(200, fileBytes.length);

            try (OutputStream os = exchange.getResponseBody()) {
                os.write(fileBytes);
                os.flush();
            }

            //Clean up
            FileStreamer.deleteManual(code);
            System.out.println("File sent and session cleaned: " + code);
        } else {
            String response = "METHOD NOT ALLOWED!";
            exchange.sendResponseHeaders(405, response.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }
    }
}
