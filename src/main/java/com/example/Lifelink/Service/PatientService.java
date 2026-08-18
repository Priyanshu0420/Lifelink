package com.example.Lifelink.Service;

import com.example.Lifelink.DTO.InsuranceRespDTO;
import com.example.Lifelink.DTO.PatientReqDTO;
import com.example.Lifelink.DTO.PatientRespDTO;
import com.example.Lifelink.Entity.User;
import com.example.Lifelink.Type.EnumBloodGroup;
import com.example.Lifelink.Type.EnumGender;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PatientService {

    InsuranceRespDTO getMyInsurance(User user);

    Page<PatientRespDTO> getAllPatients(Pageable pageable);

    List<PatientRespDTO> searchPatient(Long patientId,String name,User user);

//    PatientRespDTO getPatientByEmail(String email);
//
//    List<PatientRespDTO> getPatientsLocation(String city,String state,String country);

//    List<PatientRespDTO> getPatientByBloodGroup(EnumBloodGroup bloodGroup);

    PatientRespDTO updatePatient(Long patientId , PatientReqDTO patientReqDTO);


    void deletePatient(User user);

//    List<PatientRespDTO> searchPatientbyGender(EnumGender gender);


    PatientRespDTO getMyProfile(User user);

    PatientRespDTO updateMyProfile(User user, PatientReqDTO patientReqDTO);

    List<PatientRespDTO> getMyPatients(User user);

    List<PatientRespDTO> filterPatients(
            EnumGender gender,
            EnumBloodGroup bloodGroup,
            String city,
            String state,
            String country,
            String email);
}
