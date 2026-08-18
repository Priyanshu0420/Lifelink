package com.example.Lifelink.Controller;

import com.example.Lifelink.DTO.*;
import com.example.Lifelink.Entity.User;
import com.example.Lifelink.Service.EmergencyContactService;
import com.example.Lifelink.Service.InsuranceService;
import com.example.Lifelink.Service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final InsuranceService insuranceService;
    private final EmergencyContactService emergencyContactService;

    // Patient Features

    @GetMapping("/profile")
    public ResponseEntity<PatientRespDTO> profile(){
        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return ResponseEntity.status(HttpStatus.OK).body(patientService.getMyProfile(user));
    }

    @PatchMapping("/profile")
    public ResponseEntity<PatientRespDTO> updateProfile(@RequestBody PatientReqDTO patientReqDTO){
        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return ResponseEntity.status(HttpStatus.OK).body(patientService.updateMyProfile(user,patientReqDTO));
    }

    @DeleteMapping("/profile")
    public ResponseEntity<String> deleteMyProfile() {

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        patientService.deletePatient(user);

        return ResponseEntity.ok("Patient profile deleted successfully.");
    }

    // Insurance Features


    @PostMapping("/insurance")
    public ResponseEntity<InsuranceRespDTO> assignInsurance(
            @RequestBody InsuranceReqDTO insuranceReqDTO){

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.status(HttpStatus.CREATED).body(insuranceService.assignInsurance(user, insuranceReqDTO));
    }

    @PatchMapping("/insurance")
    public ResponseEntity<InsuranceRespDTO> updateInsurance(
            @RequestBody InsuranceReqDTO insuranceReqDTO){

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.status(HttpStatus.OK).body(insuranceService.updateInsuranceDetails(user, insuranceReqDTO));
    }

    @DeleteMapping("/insurance")
    public ResponseEntity<String> deleteInsurance(){

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        insuranceService.deleteInsurance(user);

        return ResponseEntity.ok("Insurance deleted successfully.");
    }

    // Emergency Contact Features

    @PostMapping("/emergency-contact/add-contact")
    public ResponseEntity<EmergencyContactRespDTO> addContact(
            @RequestBody EmergencyContactReqDTO emergencyContactReqDTO){

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(emergencyContactService.addContact(user, emergencyContactReqDTO));
    }

    @PatchMapping("emergency-contact/")
    public ResponseEntity<EmergencyContactRespDTO> updateContact(
            @RequestParam Long contactId,
            @RequestBody EmergencyContactReqDTO emergencyContactReqDTO){

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.ok(
                emergencyContactService.updateContactDetails(user, contactId, emergencyContactReqDTO)
        );
    }

    @GetMapping("emergency-contact/all-contacts")
    public ResponseEntity<List<EmergencyContactRespDTO>> getMyContacts(){

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.ok(emergencyContactService.getMyContact(user));
    }

    @DeleteMapping("emergency-contact/contacts/")
    public ResponseEntity<String> deleteContact(
            @RequestParam Long contactId){

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        emergencyContactService.deleteContact(user, contactId);

        return ResponseEntity.ok("Emergency Contact deleted successfully.");
    }

    @GetMapping("/insurance")
    public ResponseEntity<InsuranceRespDTO> getMyInsurance() {

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.ok(
                insuranceService.getMyInsurance(user)
        );
    }


}
