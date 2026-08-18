package com.example.Lifelink.QR;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class QRUtil {

    private static final String QR_DIRECTORY =
            System.getenv().getOrDefault("QR_DIRECTORY", "uploads/qr/");

    public String generateFileName(Long patientId) {
        return "patient-" + patientId + "-qr.png";
    }

    public String getFilePath(Long patientId) throws IOException {

        Path directory = Paths.get(QR_DIRECTORY);

        if (!Files.exists(directory)) {
            Files.createDirectories(directory);
        }

        return directory.resolve(generateFileName(patientId))
                .toString();
    }

    public void deleteQRCode(String filePath) throws IOException {

        if (filePath == null || filePath.isBlank()) {
            return;
        }

        Path path = Paths.get(filePath);

        if (Files.exists(path)) {
            Files.delete(path);
        }
    }
}
