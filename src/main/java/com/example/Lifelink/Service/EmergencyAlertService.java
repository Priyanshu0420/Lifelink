package com.example.Lifelink.Service;


import com.example.Lifelink.DTO.EmergencyAlertRespDTO;
import com.example.Lifelink.DTO.EmergencySOSReqDTO;

public interface EmergencyAlertService {

    EmergencyAlertRespDTO triggerSOS(
            Long patientId,
            EmergencySOSReqDTO request
    );
}
