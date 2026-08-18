package com.example.Lifelink.Auth;

import com.example.Lifelink.DTO.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginRespDTO> login(@RequestBody LoginReqDTO loginReqDTO){
        return ResponseEntity.status(HttpStatus.OK).body(authService.login(loginReqDTO));
    }

    @PostMapping("/patient/register")
    public ResponseEntity<PatientSignupRespDTO> register(@RequestBody PatientSignupReqDTO patientSignupReqDTO){
        return ResponseEntity.status(HttpStatus.OK).body(authService.patientSignUp(patientSignupReqDTO));
    }

    @PostMapping("/hospital/register")
    public ResponseEntity<HospitalSignupRespDTO> register(@RequestBody HospitalSignupReqDTO hospitalSignupReqDTO){
        return ResponseEntity.status(HttpStatus.OK).body(authService.hospitalSignup(hospitalSignupReqDTO));
    }
}
