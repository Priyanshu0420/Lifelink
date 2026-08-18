package com.example.Lifelink.Service.ServicesImplementation;


import com.example.Lifelink.DTO.QRCodeRespDTO;
import com.example.Lifelink.Service.QRCodeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;


import com.example.Lifelink.Entity.Patient;
import com.example.Lifelink.Entity.QRCode;
import com.example.Lifelink.Repository.PatientRepository;
import com.example.Lifelink.Repository.QrCodeRepository;
import com.example.Lifelink.QR.QRGenerator;
import com.example.Lifelink.QR.QRUtil;
import com.google.zxing.WriterException;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
@Service
@RequiredArgsConstructor
public class QRCodeServiceImpl implements QRCodeService {

    private final PatientRepository patientRepository;
    private final QrCodeRepository qrCodeRepository;
    private final QRGenerator qrGenerator;
    private final QRUtil qrUtil;
    private final ModelMapper modelMapper;

    @Value("${lifelink.public-url}")
    private String publicUrl;

    @Override
    public QRCodeRespDTO generateQRCode(Long patientId) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found with ID: " + patientId
                        )
                );

        // =====================================================
        // CHECK IF QR CODE ALREADY EXISTS
        // =====================================================

        java.util.Optional<QRCode> existingQRCode =
                qrCodeRepository.findByPatient_PatientId(patientId);

        if (existingQRCode.isPresent()) {

            QRCode qrCode = existingQRCode.get();

            // If database record exists and image file also exists,
            // simply return the existing QR.
            if (qrCode.getImagePath() != null
                    && Files.exists(Paths.get(qrCode.getImagePath()))) {

                return mapToDTO(qrCode);
            }

            // If database record exists but image file is missing,
            // regenerate the image using the existing database record.
            try {

                String qrValue =
                        publicUrl + "/public/patient/" + patientId;

                String filePath =
                        qrUtil.getFilePath(patientId);

                qrGenerator.generateQRCode(
                        qrValue,
                        filePath,
                        300,
                        300
                );

                qrCode.setQrValue(qrValue);
                qrCode.setImagePath(filePath);

                QRCode updatedQRCode =
                        qrCodeRepository.save(qrCode);

                return mapToDTO(updatedQRCode);

            } catch (IOException | WriterException e) {

                throw new RuntimeException(
                        "Failed to regenerate missing QR Code image",
                        e
                );
            }
        }


        // =====================================================
        // NO QR EXISTS → CREATE NEW ONE
        // =====================================================

        String qrValue =
                publicUrl + "/public/patient/" + patientId;

        String filePath;

        try {

            filePath = qrUtil.getFilePath(patientId);

            qrGenerator.generateQRCode(
                    qrValue,
                    filePath,
                    300,
                    300
            );

        } catch (IOException | WriterException e) {

            throw new RuntimeException(
                    "Failed to generate QR Code",
                    e
            );
        }


        QRCode qrCode = QRCode.builder()
                .qrValue(qrValue)
                .imagePath(filePath)
                .patient(patient)
                .build();

        QRCode savedQRCode =
                qrCodeRepository.save(qrCode);

        return mapToDTO(savedQRCode);
    }

    @Override
    public byte[] downloadQRCode(Long patientId) {

        QRCode qrCode = qrCodeRepository
                .findByPatient_PatientId(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "QR Code not found for patient: " + patientId
                        )
                );

        try {

            Path path = Paths.get(qrCode.getImagePath());

            // =================================================
            // IMAGE DOES NOT EXIST
            // =================================================

            if (!Files.exists(path)) {

                String qrValue =
                        publicUrl + "/public/patient/" + patientId;

                String filePath =
                        qrUtil.getFilePath(patientId);

                qrGenerator.generateQRCode(
                        qrValue,
                        filePath,
                        300,
                        300
                );

                qrCode.setQrValue(qrValue);
                qrCode.setImagePath(filePath);

                qrCodeRepository.save(qrCode);

                path = Paths.get(filePath);
            }


            // =================================================
            // READ IMAGE
            // =================================================

            if (!Files.exists(path)) {

                throw new RuntimeException(
                        "QR Code image could not be created"
                );
            }

            return Files.readAllBytes(path);

        } catch (IOException | WriterException e) {

            throw new RuntimeException(
                    "Failed to read QR Code image",
                    e
            );
        }
    }

    @Override
    public QRCodeRespDTO regenerateQRCode(Long patientId) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found with ID: " + patientId
                        )
                );

        QRCode qrCode = qrCodeRepository
                .findByPatient_PatientId(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "QR Code not found for patient: " + patientId
                        )
                );

        try {

            qrUtil.deleteQRCode(qrCode.getImagePath());

            String qrValue =
                    publicUrl + "/public/patient/" + patientId;

            String filePath =
                    qrUtil.getFilePath(patientId);

            qrGenerator.generateQRCode(
                    qrValue,
                    filePath,
                    300,
                    300
            );

            qrCode.setQrValue(qrValue);
            qrCode.setImagePath(filePath);
            qrCode.setPatient(patient);

            QRCode updatedQRCode =
                    qrCodeRepository.save(qrCode);

            return mapToDTO(updatedQRCode);

        } catch (IOException | WriterException e) {

            throw new RuntimeException(
                    "Failed to regenerate QR Code",
                    e
            );
        }
    }

    private QRCodeRespDTO mapToDTO(QRCode qrCode) {

        QRCodeRespDTO dto =
                modelMapper.map(qrCode, QRCodeRespDTO.class);

        dto.setPatientId(
                qrCode.getPatient().getPatientId()
        );

        return dto;
    }
}