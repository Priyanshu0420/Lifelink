package com.example.Lifelink.Service;

import com.example.Lifelink.DTO.PublicPatientRespDTO;

public interface PublicPatientService {

    PublicPatientRespDTO getPublicPatient(Long patientId);
}
