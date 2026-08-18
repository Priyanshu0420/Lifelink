package com.example.Lifelink.Repository;

import com.example.Lifelink.Entity.QRCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QrCodeRepository extends JpaRepository<QRCode,Long> {

    Optional<QRCode> findByPatient_PatientId(Long patientId);
}
