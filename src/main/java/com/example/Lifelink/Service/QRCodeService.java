package com.example.Lifelink.Service;

import com.example.Lifelink.DTO.QRCodeRespDTO;
import com.example.Lifelink.Entity.QRCode;

public interface QRCodeService {

    QRCodeRespDTO generateQRCode(Long patientId);

    byte[] downloadQRCode(Long patientId);

    QRCodeRespDTO regenerateQRCode(Long patientId);
}
