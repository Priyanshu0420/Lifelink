package com.example.Lifelink.Controller;

import com.example.Lifelink.DTO.HospitalRespDTO;
import com.example.Lifelink.DTO.PatientReqDTO;
import com.example.Lifelink.DTO.PatientRespDTO;
import com.example.Lifelink.Service.HospitalService;
import com.example.Lifelink.Service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final HospitalService hospitalService;
    private final PatientService patientService;

    @GetMapping("/hospital/get-all-hospitals")
    public ResponseEntity<List<HospitalRespDTO>> getAllHospitals() {

        return ResponseEntity.ok(
                hospitalService.getAllHospitals()
        );
    }

    @PutMapping("/hospital/{hospitalId}/approve")
    public ResponseEntity<String> approveHospital(
            @PathVariable Long hospitalId) {

        hospitalService.approveHospital(hospitalId);

        return ResponseEntity.ok("Hospital approved successfully.");
    }

    @PutMapping("/hospital/{hospitalId}/reject")
    public ResponseEntity<String> rejectHospital(
            @PathVariable Long hospitalId) {

        hospitalService.rejectHospital(hospitalId);

        return ResponseEntity.ok("Hospital rejected successfully.");
    }


    @GetMapping("/patient/get-all-patients")
    public ResponseEntity<Page<PatientRespDTO>> getAllPatients(
            @PageableDefault(page = 0, size = 15, sort = "patientId") Pageable pageable) {

        return ResponseEntity.ok(patientService.getAllPatients(pageable));
    }


    @PutMapping("/patient/{patientId}/update-patient")
    public ResponseEntity<PatientRespDTO> updatePatient(
            @PathVariable Long patientId, @RequestBody PatientReqDTO patientReqDTO){
        return ResponseEntity.ok(patientService.updatePatient(patientId,patientReqDTO));
    }

}
