package org.sharing;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.parser.Multiparser;

import java.io.*;
import java.util.Map;

public class UploadHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        Headers headers = exchange.getResponseHeaders();
        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "POST, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (exchange.getRequestMethod().equals("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if(exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            String response = "METHOD NOT ALLOWED!";
            exchange.sendResponseHeaders(405, response.getBytes().length);
            try(OutputStream oos = exchange.getResponseBody()) {
                oos.write(response.getBytes());
            }
        }

        Headers requestHeaders = exchange.getRequestHeaders();
        String contentType = requestHeaders.getFirst("Content-Type");
        if(contentType == null || !contentType.startsWith("multipart/form-data")) {
            String response = "Bad request: Content-Type must be of multipart/form-data.";
            exchange.sendResponseHeaders(400, response.getBytes().length);
            try(OutputStream oos = exchange.getResponseBody()) {
                oos.write(response.getBytes());
            }
        } else {
            try {
                InputStream body = exchange.getRequestBody();
                BufferedReader reader = new BufferedReader(new InputStreamReader(body));
                Multiparser parser = new Multiparser(body, contentType);
                String filepath = parser.readBytes(FileController.getUploadDir());

//                start streaming
                FileStreamer.StreamResult result = FileStreamer.start(new File(filepath));

                String response = FileController.toJson(Map.of("message", "file uploaded successfully!", "code", result.code()));

                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, response.getBytes().length);
                try (OutputStream oos = exchange.getResponseBody()) {
                    oos.write(response.getBytes());
                    oos.flush();
                }

            } catch (Exception e) {
                e.printStackTrace();  // See what exception is crashing it
                String error = "Internal Server Error: " + e.getMessage();
                exchange.sendResponseHeaders(500, error.getBytes().length);
                try (OutputStream oos = exchange.getResponseBody()) {
                    oos.write(error.getBytes());
                }
            }
        }
    }

}
