package com.example.Lifelink.Service.ServicesImplementation;

import com.example.Lifelink.DTO.EmergencyAlertRespDTO;
import com.example.Lifelink.DTO.EmergencySOSReqDTO;
import com.example.Lifelink.Entity.EmergencyAlert;
import com.example.Lifelink.Entity.Hospital;
import com.example.Lifelink.Entity.Patient;
import com.example.Lifelink.Repository.EmergencyAlertRepository;
import com.example.Lifelink.Repository.HospitalRepository;
import com.example.Lifelink.Repository.PatientRepository;
import com.example.Lifelink.Service.EmergencyAlertService;
import com.example.Lifelink.Service.NotificationService;
import com.example.Lifelink.Type.EnumAlert;
import com.example.Lifelink.Type.EnumHospitalStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmergencyAlertServiceImpl implements EmergencyAlertService {

    private final PatientRepository patientRepository;
    private final HospitalRepository hospitalRepository;
    private final EmergencyAlertRepository emergencyAlertRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public EmergencyAlertRespDTO triggerSOS(
            Long patientId,
            EmergencySOSReqDTO request
    ) {

        // ---------------------------------------------------------
        // 1. Find patient
        // ---------------------------------------------------------
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found with ID: " + patientId
                        )
                );

        // ---------------------------------------------------------
        // 2. Validate patient location
        // ---------------------------------------------------------
        if (request.getLatitude() == null ||
                request.getLongitude() == null) {

            throw new RuntimeException(
                    "Location is required to trigger SOS"
            );
        }

        // ---------------------------------------------------------
        // 3. Find all approved hospitals
        // ---------------------------------------------------------
        List<Hospital> hospitals =
                hospitalRepository.findByStatus(
                        EnumHospitalStatus.Approved
                );

        if (hospitals.isEmpty()) {
            throw new RuntimeException(
                    "No approved hospital available"
            );
        }

        // ---------------------------------------------------------
        // 4. Find nearest approved hospital
        // ---------------------------------------------------------
        Hospital nearestHospital =
                findNearestHospital(
                        request.getLatitude(),
                        request.getLongitude(),
                        hospitals
                );

        // ---------------------------------------------------------
        // 5. Create Emergency Alert
        // ---------------------------------------------------------
        EmergencyAlert alert = EmergencyAlert.builder()
                .patient(patient)
                .hospital(nearestHospital)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(EnumAlert.PENDING)
                .notes("SOS triggered through public QR scan")
                .build();

        // ---------------------------------------------------------
        // 6. Save Emergency Alert
        // ---------------------------------------------------------
        EmergencyAlert savedAlert =
                emergencyAlertRepository.save(alert);

        // ---------------------------------------------------------
        // 7. Send emergency notifications
        // ---------------------------------------------------------
        notificationService.sendEmergencyNotifications(savedAlert);

        // ---------------------------------------------------------
        // 8. Return response
        // ---------------------------------------------------------
        return EmergencyAlertRespDTO.builder()

                // IMPORTANT:
                // Return the generated database ID
                .alertId(savedAlert.getAlertId())

                .patientName(patient.getPatientName())

                .hospitalName(nearestHospital.getHospitalName())

                .scanTime(savedAlert.getScanTime())

                .latitude(savedAlert.getLatitude())

                .longitude(savedAlert.getLongitude())

                .status(savedAlert.getStatus())

                .message("SOS triggered successfully")

                .build();
    }

    // ============================================================
    // FIND NEAREST HOSPITAL
    // ============================================================

    private Hospital findNearestHospital(
            Double latitude,
            Double longitude,
            List<Hospital> hospitals
    ) {

        Hospital nearestHospital = null;

        double shortestDistance = Double.MAX_VALUE;

        for (Hospital hospital : hospitals) {

            // Ignore hospitals without valid coordinates
            if (hospital.getLatitude() == null ||
                    hospital.getLongitude() == null) {
                continue;
            }

            double distance = calculateDistance(
                    latitude,
                    longitude,
                    hospital.getLatitude(),
                    hospital.getLongitude()
            );

            if (distance < shortestDistance) {

                shortestDistance = distance;

                nearestHospital = hospital;
            }
        }

        if (nearestHospital == null) {

            throw new RuntimeException(
                    "No approved hospital has valid location"
            );
        }

        return nearestHospital;
    }

    // ============================================================
    // HAVERSINE DISTANCE CALCULATION
    // ============================================================

    private double calculateDistance(
            double lat1,
            double lon1,
            double lat2,
            double lon2
    ) {

        final int EARTH_RADIUS_KM = 6371;

        double latDistance =
                Math.toRadians(lat2 - lat1);

        double lonDistance =
                Math.toRadians(lon2 - lon1);

        double a =
                Math.sin(latDistance / 2)
                        * Math.sin(latDistance / 2)
                        +
                        Math.cos(Math.toRadians(lat1))
                                * Math.cos(Math.toRadians(lat2))
                                * Math.sin(lonDistance / 2)
                                * Math.sin(lonDistance / 2);

        double c =
                2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a)
                );

        return EARTH_RADIUS_KM * c;
    }
}