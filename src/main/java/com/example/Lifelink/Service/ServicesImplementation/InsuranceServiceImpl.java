package com.example.Lifelink.Service.ServicesImplementation;

import com.example.Lifelink.DTO.InsuranceReqDTO;
import com.example.Lifelink.DTO.InsuranceRespDTO;
import com.example.Lifelink.Entity.Insurance;
import com.example.Lifelink.Entity.Patient;
import com.example.Lifelink.Entity.User;
import com.example.Lifelink.Repository.InsuranceRepository;
import com.example.Lifelink.Repository.PatientRepository;
import com.example.Lifelink.Service.InsuranceService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InsuranceServiceImpl implements InsuranceService {

    private final PatientRepository patientRepository;
    private final InsuranceRepository insuranceRepository;
    private final ModelMapper modelMapper;

    @Override
    public InsuranceRespDTO assignInsurance(User user, InsuranceReqDTO insuranceReqDTO) {

        Patient patient=patientRepository.findById(user.getUserId()).orElseThrow(()-> new EntityNotFoundException("Patient not found!!"));
        if (patient.getInsurance() != null) {
            throw new IllegalStateException(
                    "Patient already has an insurance policy");
        }
        Insurance insurance=modelMapper.map(insuranceReqDTO, Insurance.class);
        patient.setInsurance(insurance);
        insurance.setPatient(patient);
        return modelMapper.map(insuranceRepository.save(insurance), InsuranceRespDTO.class);
    }

    @Override
    public InsuranceRespDTO updateInsuranceDetails(User user, InsuranceReqDTO insuranceReqDTO) {
        Insurance insurance=insuranceRepository.findByPatient_User_UserId(user.getUserId()).orElseThrow(()-> new EntityNotFoundException("Insurance not found!!"));
        if(insuranceReqDTO.getProviderName() !=null){
            insurance.setProviderName(insuranceReqDTO.getProviderName());
        }
        if(insuranceReqDTO.getPolicyType() !=null){
            insurance.setPolicyType(insuranceReqDTO.getPolicyType());
        }
        if(insuranceReqDTO.getPolicyNumber() !=null){
            insurance.setPolicyNumber(insuranceReqDTO.getPolicyNumber());
        }
        if(insuranceReqDTO.getStartDate() !=null){
            insurance.setStartDate(insuranceReqDTO.getStartDate());
        }
        if(insuranceReqDTO.getExpiryDate() !=null){
            insurance.setExpiryDate(insuranceReqDTO.getExpiryDate());
        }
        if(insuranceReqDTO.getCoverageDetails() !=null){
            insurance.setCoverageDetails(insuranceReqDTO.getCoverageDetails());
        }

        return modelMapper.map(insuranceRepository.save(insurance), InsuranceRespDTO.class);

    }

    @Override
    public void deleteInsurance(User user) {

        Patient patient = patientRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found!"));

        Insurance insurance = patient.getInsurance();

        if (insurance == null) {
            throw new EntityNotFoundException("Insurance not found!");
        }
        patient.setInsurance(null);
        insurance.setPatient(null);

        insuranceRepository.delete(insurance);
    }

    @Override
    public InsuranceRespDTO getMyInsurance(User user) {

        Insurance insurance = insuranceRepository
                .findByPatient_User_UserId(user.getUserId())
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Insurance not found!"
                        )
                );

        return modelMapper.map(
                insurance,
                InsuranceRespDTO.class
        );
    }


}
