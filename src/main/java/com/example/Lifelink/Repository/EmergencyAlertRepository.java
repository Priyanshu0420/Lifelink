package com.example.Lifelink.Repository;

import com.example.Lifelink.Entity.EmergencyAlert;
import com.example.Lifelink.Entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EmergencyAlertRepository extends JpaRepository<EmergencyAlert,Long> {

    List<EmergencyAlert> findByHospitalAndScanTimeBetween(
            Hospital hospital,
            LocalDateTime start,
            LocalDateTime end
    );

    List<EmergencyAlert> findByHospitalOrderByScanTimeDesc(
            Hospital hospital
    );

    Optional<EmergencyAlert> findByAlertIdAndHospital(
            Long alertId,
            Hospital hospital
    );
}
