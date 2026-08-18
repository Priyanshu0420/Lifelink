package com.example.Lifelink.Auth;

import com.example.Lifelink.DTO.*;
import com.example.Lifelink.Entity.Hospital;
import com.example.Lifelink.Entity.Patient;
import com.example.Lifelink.Entity.User;
import com.example.Lifelink.Repository.UserRepository;
import com.example.Lifelink.Type.EnumHospitalStatus;
import com.example.Lifelink.Type.EnumRoles;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    public LoginRespDTO login(LoginReqDTO loginReqDTO) {
        Authentication authentication= authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginReqDTO.getUsername(),loginReqDTO.getPassword()));
        User user= (User) authentication.getPrincipal();
        String token= authUtil.generateAccessToken(user);

        return new LoginRespDTO(token, user.getUsername(), user.getUserId(),user.getRole());
    }

    public PatientSignupRespDTO patientSignUp(PatientSignupReqDTO patientSignupReqDTO) {
        if(userRepository.findByUsername(patientSignupReqDTO.getUsername()).isPresent()){
            throw new IllegalArgumentException("User already exists with username: "+patientSignupReqDTO.getUsername());
        }
        User user=User.builder()
                .name(patientSignupReqDTO.getName())
                .username(patientSignupReqDTO
                        .getUsername())
                .password(passwordEncoder.encode(
                        patientSignupReqDTO.getPassword()
                ))
                .role(Set.of(EnumRoles.PATIENT))
                .build();

        Patient patient=Patient.builder()
                .patientName(user.getName())
                .email(user.getUsername())
                .build();
        patient.setUser(user);
        user.setPatient(patient);

        User savedUser =userRepository.save(user);

        return new PatientSignupRespDTO(savedUser.getUserId(),
                savedUser.getName(), savedUser.getUsername(), EnumRoles.PATIENT,savedUser.isEnabled(),savedUser.getCreatedAt());
    }

    public HospitalSignupRespDTO hospitalSignup(HospitalSignupReqDTO hospitalSignupReqDTO) {
        if(userRepository.findByUsername(hospitalSignupReqDTO.getUsername()).isPresent()){
            throw new IllegalArgumentException("User already exists with username: "+hospitalSignupReqDTO.getUsername());
        }
        User user=User.builder()
                .name(hospitalSignupReqDTO.getName())
                .username(hospitalSignupReqDTO
                        .getUsername())
                .password(passwordEncoder.encode(
                        hospitalSignupReqDTO.getPassword()
                ))
                .role(Set.of(EnumRoles.HOSPITAL))
                .build();

        Hospital hospital=Hospital.builder()
                .hospitalName(user.getName())
                .email(user.getUsername())
                .status(EnumHospitalStatus.Pending)
                .build();
        hospital.setUser(user);
        user.setHospital(hospital);

        User savedUser =userRepository.save(user);

        return new HospitalSignupRespDTO(savedUser.getUserId(), savedUser.getName(),
                savedUser.getUsername(), EnumRoles.HOSPITAL, savedUser.isEnabled(), savedUser.getCreatedAt());
    }
}
