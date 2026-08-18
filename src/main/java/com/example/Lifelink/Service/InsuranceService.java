package com.example.Lifelink.Service;

import com.example.Lifelink.DTO.InsuranceReqDTO;
import com.example.Lifelink.DTO.InsuranceRespDTO;
import com.example.Lifelink.Entity.User;

public interface InsuranceService {

    InsuranceRespDTO assignInsurance(User user, InsuranceReqDTO insuranceReqDTO);

    InsuranceRespDTO updateInsuranceDetails(User user, InsuranceReqDTO insuranceReqDTO);

    void deleteInsurance(User user);

    InsuranceRespDTO getMyInsurance(User user);
}
