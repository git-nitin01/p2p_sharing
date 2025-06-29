package org.parser;
import java.io.*;

public class Multiparser {
    private InputStream body;
    private String boundary;
    private String filename;

    public Multiparser(InputStream body, String contentType) {
        this.body = body;
        this.boundary = getBoundry(contentType);
    }

    private String getBoundry(String contentType) {
        String[] parts = contentType.split(";");

        for(String part: parts) {
            part = part.trim();
            if(part.startsWith("boundary=")) {
                String boundary = part.substring("boundary=".length());
                if (boundary.startsWith("\"") && boundary.endsWith("\"")) {
                    boundary = boundary.substring(1, boundary.length() - 1);
                }
                return boundary;
            }
        }

        throw new IllegalArgumentException("Boundary not found in Content-Type");
    }

    public String readBytes(String uploadDir) throws IOException {
        PushbackInputStream pbStream = new PushbackInputStream(this.body, 8192);
        ByteArrayOutputStream headerBuffer = new ByteArrayOutputStream();

        int b;
        int state = 0;
        while ((b = pbStream.read()) != -1) {
            headerBuffer.write(b);

            if (state == 0 && b == '\r') state = 1;
            else if (state == 1 && b == '\n') state = 2;
            else if (state == 2 && b == '\r') state = 3;
            else if (state == 3 && b == '\n') break;
            else state = 0;
        }

        String headers = headerBuffer.toString();
        String filename = "unknown";
        for(String line : headers.split("\r\n")) {
            if(line.contains("filename=")) {
                filename = line.substring(line.indexOf("filename=") + 9).replace("\"","").trim();
                this.filename = filename;
                break;
            }
        }

        ByteArrayOutputStream checkBuffer = new ByteArrayOutputStream();
        String boundaryMarker = "--" + this.boundary;
        String filepath = uploadDir + File.separator + filename;
        try(FileOutputStream fos = new FileOutputStream(filepath)) {
            byte[] chunk = new byte[8192];
            int bytesRead;
            boolean boundaryFound = false;

            while((bytesRead = pbStream.read(chunk)) != -1) {
                checkBuffer.write(chunk, 0, bytesRead);
                String data =  checkBuffer.toString("ISO_8859_1");

                int boundaryIndex = data.indexOf(boundaryMarker);
                if(boundaryIndex != -1) {
                    byte[] fileBytes = checkBuffer.toByteArray();
                    fos.write(fileBytes, 0, boundaryIndex);
                    boundaryFound = true;
                    break;
                }
            }

            if(!boundaryFound) {
                fos.write(checkBuffer.toByteArray());
            }
        }

        return filepath;
    }

    public String getFileName() {
        return this.filename;
    }

}
