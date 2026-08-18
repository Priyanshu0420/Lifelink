package com.example.Lifelink.Controller;

import com.example.Lifelink.DTO.QRCodeRespDTO;
import com.example.Lifelink.Service.QRCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/qr")
@RequiredArgsConstructor
public class QRController {

    private final QRCodeService qrCodeService;

    // Generate QR Code
    @PostMapping("/generate/{patientId}")
    public ResponseEntity<QRCodeRespDTO> generateQRCode(
            @PathVariable Long patientId
    ) {

        QRCodeRespDTO response =
                qrCodeService.generateQRCode(patientId);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // Download QR Code
    @GetMapping("/download/{patientId}")
    public ResponseEntity<byte[]> downloadQRCode(
            @PathVariable Long patientId
    ) {

        byte[] qrImage =
                qrCodeService.downloadQRCode(patientId);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"patient-"
                                + patientId
                                + "-qr.png\""
                )
                .body(qrImage);
    }

    // Regenerate QR Code
    @PostMapping("/regenerate/{patientId}")
    public ResponseEntity<QRCodeRespDTO> regenerateQRCode(
            @PathVariable Long patientId
    ) {

        QRCodeRespDTO response =
                qrCodeService.regenerateQRCode(patientId);

        return ResponseEntity.ok(response);
    }
}