package org.sharing;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class ResolveHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if(!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            String response = "METHOD NOT ALLOWED!";
            exchange.sendResponseHeaders(405, response.length());
            try(OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }

        URI uri = exchange.getRequestURI();
        String queryParam = uri.getQuery();

        String code = null;
        if(queryParam!=null && queryParam.startsWith("code=")) {
            code = queryParam.substring(5);
        }

        Integer port = FileStreamer.getPort(code);
        String filename = FileStreamer.getFileName(code);

        String response;
        int status;
        if(port == null) {
            response = FileController.toJson(Map.of("error", "Invalid or Expired Session!"));
            status = 404;
        } else {
            response = FileController.toJson(Map.of("port", port.toString(), "file", filename));
            status = 200;
        }

        System.out.println(response);
        byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);

        Headers responseHeaders = exchange.getResponseHeaders();
        responseHeaders.set("Content-Type", "application/json; charset=UTF-8");
        responseHeaders.set("Content-Length", String.valueOf(responseBytes.length));
        responseHeaders.set("Connection", "close");

        exchange.sendResponseHeaders(200, responseBytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(responseBytes);
        }
    }

}
