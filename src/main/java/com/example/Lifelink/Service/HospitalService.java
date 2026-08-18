package com.example.Lifelink.Service;

import com.example.Lifelink.DTO.HospitalEmergencyRespDTO;
import com.example.Lifelink.DTO.HospitalReqDTO;
import com.example.Lifelink.DTO.HospitalRespDTO;
import com.example.Lifelink.DTO.UpdateEmergencyStatusDTO;
import com.example.Lifelink.Entity.User;

import java.util.List;

public interface HospitalService {

    HospitalRespDTO createHospital(HospitalReqDTO hospitalReqDTO);

    HospitalRespDTO updateMyProfile( HospitalReqDTO hospitalReqDTO, User user);

    void deleteHospital(User user);

    List<HospitalRespDTO> searchHospital(String hospitalName);

    List<HospitalRespDTO> getAllHospitals();

    HospitalRespDTO getHospitalById(Long hospitalId);

    HospitalRespDTO getMyProfile(User user);

    void approveHospital(Long hospitalId);

    void rejectHospital(Long hospitalId);

    List<HospitalEmergencyRespDTO> getTodaysEmergencies(User user);

    HospitalEmergencyRespDTO getEmergencyById(Long alertId, User user);

    HospitalEmergencyRespDTO updateEmergencyStatus(Long alertId, UpdateEmergencyStatusDTO request, User user);

    List<HospitalEmergencyRespDTO> getEmergencyHistory(User user);

}
