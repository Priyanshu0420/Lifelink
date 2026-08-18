package com.example.Lifelink.QR;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;

@Component
public class QRGenerator {

    public void generateQRCode(
            String qrContent,
            String filePath,
            int width,
            int height
    ) throws WriterException, IOException {

        QRCodeWriter qrCodeWriter = new QRCodeWriter();

        BitMatrix bitMatrix = qrCodeWriter.encode(
                qrContent,
                BarcodeFormat.QR_CODE,
                width,
                height
        );

        Path path = FileSystems.getDefault().getPath(filePath);

        MatrixToImageWriter.writeToPath(
                bitMatrix,
                "PNG",
                path
        );
    }
}
