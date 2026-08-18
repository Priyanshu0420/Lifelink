package com.example.Lifelink.Controller;

import com.example.Lifelink.DTO.EmergencyAlertRespDTO;
import com.example.Lifelink.DTO.EmergencySOSReqDTO;
import com.example.Lifelink.DTO.HospitalRespDTO;
import com.example.Lifelink.DTO.PublicPatientRespDTO;
import com.example.Lifelink.Service.EmergencyAlertService;
import com.example.Lifelink.Service.HospitalService;
import com.example.Lifelink.Service.PublicPatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {


    private final HospitalService hospitalService;
    private final PublicPatientService publicPatientService;
    private final EmergencyAlertService emergencyAlertService;

    @GetMapping("/hospital/hospitals-List")
    public ResponseEntity<List<HospitalRespDTO>> hospitalsList(){
        return ResponseEntity.status(HttpStatus.OK).body(hospitalService.getAllHospitals());
    }

    // Scan QR → Get emergency information
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<PublicPatientRespDTO> getPatientEmergencyInfo(
            @PathVariable Long patientId
    ) {

        PublicPatientRespDTO response =
                publicPatientService.getPublicPatient(patientId);

        return ResponseEntity.ok(response);
    }

    // Press SOS
    @PostMapping("/patient/{patientId}/sos")
    public ResponseEntity<EmergencyAlertRespDTO> triggerSOS(
            @PathVariable Long patientId,
            @RequestBody EmergencySOSReqDTO request
    ) {

        EmergencyAlertRespDTO response =
                emergencyAlertService.triggerSOS(
                        patientId,
                        request
                );

        return ResponseEntity.ok(response);
    }
}

