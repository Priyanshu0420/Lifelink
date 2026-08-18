package com.example.Lifelink.Controller;

import com.example.Lifelink.DTO.*;
import com.example.Lifelink.Entity.User;
import com.example.Lifelink.Service.HospitalService;
import com.example.Lifelink.Service.PatientService;
import com.example.Lifelink.Type.EnumBloodGroup;
import com.example.Lifelink.Type.EnumGender;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/hospital")
@RequiredArgsConstructor
public class HospitalController {

    private final PatientService patientService;
    private final HospitalService hospitalService;


    // =========================================================
    // HOSPITAL PROFILE
    // =========================================================

    @GetMapping("/profile")
    public ResponseEntity<HospitalRespDTO> myProfile() {

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(hospitalService.getMyProfile(user));
    }


    @PatchMapping("/profile")
    public ResponseEntity<HospitalRespDTO> updateProfile(
            @RequestBody HospitalReqDTO hospitalReqDTO) {

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(hospitalService.updateMyProfile(
                        hospitalReqDTO,
                        user
                ));
    }


    @DeleteMapping("/profile")
    public ResponseEntity<String> deleteMyProfile() {

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        hospitalService.deleteHospital(user);

        return ResponseEntity.ok(
                "Hospital profile deleted successfully."
        );
    }


    // =========================================================
    // PATIENT MANAGEMENT
    // =========================================================

    @GetMapping("/hospital/patient/search/")
    public ResponseEntity<List<PatientRespDTO>> searchPatient(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) String name) {

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.ok(
                patientService.searchPatient(
                        patientId,
                        name,
                        user
                )
        );
    }


    @GetMapping("/hospital/patients")
    public ResponseEntity<List<PatientRespDTO>> myPatients() {

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.ok(
                patientService.getMyPatients(user)
        );
    }


    @GetMapping("/patients/search&filter/")
    public ResponseEntity<List<PatientRespDTO>> filterPatients(
            @RequestParam(required = false) EnumGender gender,
            @RequestParam(required = false) EnumBloodGroup bloodGroup,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String email) {

        return ResponseEntity.ok(
                patientService.filterPatients(
                        gender,
                        bloodGroup,
                        city,
                        state,
                        country,
                        email
                )
        );
    }


    // =========================================================
    // EMERGENCY DASHBOARD
    // =========================================================

    // View today's emergencies
    @GetMapping("/emergencies/today")
    public ResponseEntity<List<HospitalEmergencyRespDTO>>
    getTodaysEmergencies() {

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.ok(
                hospitalService.getTodaysEmergencies(user)
        );
    }


    // View a particular emergency
    @GetMapping("/emergencies/{alertId}")
    public ResponseEntity<HospitalEmergencyRespDTO>
    getEmergencyById(
            @PathVariable Long alertId) {

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.ok(
                hospitalService.getEmergencyById(
                        alertId,
                        user
                )
        );
    }


    // Update emergency status
    @PatchMapping("/emergencies/{alertId}/status")
    public ResponseEntity<HospitalEmergencyRespDTO>
    updateEmergencyStatus(
            @PathVariable Long alertId,
            @RequestBody UpdateEmergencyStatusDTO request) {

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.ok(
                hospitalService.updateEmergencyStatus(
                        alertId,
                        request,
                        user
                )
        );
    }


    // View emergency history
    @GetMapping("/emergencies/history")
    public ResponseEntity<List<HospitalEmergencyRespDTO>>
    getEmergencyHistory() {

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.ok(
                hospitalService.getEmergencyHistory(user)
        );
    }
}
