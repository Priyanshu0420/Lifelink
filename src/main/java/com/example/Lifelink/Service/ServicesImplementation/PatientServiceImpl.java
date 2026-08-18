package com.example.Lifelink.Service.ServicesImplementation;

import com.example.Lifelink.DTO.InsuranceRespDTO;
import com.example.Lifelink.DTO.PatientReqDTO;
import com.example.Lifelink.DTO.PatientRespDTO;
import com.example.Lifelink.Entity.Hospital;
import com.example.Lifelink.Entity.Insurance;
import com.example.Lifelink.Entity.Patient;
import com.example.Lifelink.Entity.User;
import com.example.Lifelink.Repository.HospitalRepository;
import com.example.Lifelink.Repository.InsuranceRepository;
import com.example.Lifelink.Repository.PatientRepository;
import com.example.Lifelink.Repository.UserRepository;
import com.example.Lifelink.Service.PatientService;
import com.example.Lifelink.Service.Specification.PatientSpecification;
import com.example.Lifelink.Type.EnumBloodGroup;
import com.example.Lifelink.Type.EnumGender;
import com.example.Lifelink.Type.EnumRoles;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final InsuranceRepository insuranceRepository;

    @Override
    public PatientRespDTO getMyProfile(User user) {

        Patient patient = patientRepository
                .findByUserUserId(user.getUserId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Patient profile not found."));

        return modelMapper.map(patient, PatientRespDTO.class);
    }

    @Override
    public Page<PatientRespDTO> getAllPatients(Pageable pageable) {
        Page<Patient> patients = patientRepository.findAll(pageable);
        return patients.map(patient -> modelMapper.map(patient, PatientRespDTO.class));
    }

    @Override
    public List<PatientRespDTO> searchPatient(Long patientId, String name, User user) {
        Hospital hospital = hospitalRepository
                .findByUserUserId(user.getUserId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Hospital not found"));

        if (patientId != null) {
            return patientRepository
                    .findByPatientIdAndHospitalsContains(patientId, hospital)
                    .map(patient ->
                            List.of(modelMapper.map(patient,
                                    PatientRespDTO.class)))
                    .orElse(Collections.emptyList());
        }
        if (name != null && !name.isBlank()) {
            return patientRepository.findByPatientNameContainingIgnoreCaseAndHospitalsContains(name, hospital).stream().map(patient -> modelMapper.map(patient, PatientRespDTO.class)).toList();
        }

        return Collections.emptyList();
    }

//    @Override
//    public PatientRespDTO getPatientByEmail(String email) {
//        Patient patient= patientRepository.findByEmail(email).orElseThrow(()-> new EntityNotFoundException("Patient with "+ email+" not found!!"));
//        return modelMapper.map(patient, PatientRespDTO.class);
//    }

//    @Override
//    public List<PatientRespDTO> getPatientsLocation(String city, String state, String country) {
//        if(city !=null){
//            return patientRepository.findByCity(city).stream().map(patient -> modelMapper.map(patient, PatientRespDTO.class)).toList();
//        }
//        if(state !=null){
//            return patientRepository.findByState(state).stream().map(patient -> modelMapper.map(patient, PatientRespDTO.class)).toList();
//        }
//        if(country !=null){
//            return patientRepository.findByCountry(country).stream().map(patient -> modelMapper.map(patient, PatientRespDTO.class)).toList();
//        }
//        return Collections.emptyList();
//    }

//    @Override
//    public List<PatientRespDTO> getPatientByBloodGroup(EnumBloodGroup bloodGroup) {
//        List<Patient> patients = patientRepository.findByBloodGroup(bloodGroup);
//
//        if (patients.isEmpty()) {
//            throw new EntityNotFoundException(
//                    "No patients found with blood group " + bloodGroup);
//        }
//
//        return patients.stream()
//                .map(patient -> modelMapper.map(patient, PatientRespDTO.class))
//                .toList();
//    }

    @Override
    @Transactional
    public PatientRespDTO updatePatient(
            Long patientID,
            PatientReqDTO patientReqDTO) {

        Patient patient = patientRepository
                .findById(patientID)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Patient not found with id: " + patientID));

        if (patientReqDTO.getGender() != null) {
            patient.setGender(patientReqDTO.getGender());
        }

        if (patientReqDTO.getBloodGroup() != null) {
            patient.setBloodGroup(patientReqDTO.getBloodGroup());
        }

        if (patientReqDTO.getDateOfBirth() != null) {
            patient.setDateOfBirth(patientReqDTO.getDateOfBirth());
        }

        if (patientReqDTO.getHeight() != null &&
                patientReqDTO.getHeight() > 0) {

            patient.setHeight(patientReqDTO.getHeight());
        }

        if (patientReqDTO.getWeight() != null &&
                patientReqDTO.getWeight() > 0) {

            patient.setWeight(patientReqDTO.getWeight());
        }

        if (patientReqDTO.getAllergies() != null) {
            patient.setAllergies(patientReqDTO.getAllergies());
        }

        if (patientReqDTO.getMedicalConditions() != null) {
            patient.setMedicalConditions(
                    patientReqDTO.getMedicalConditions()
            );
        }

        if (patientReqDTO.getCurrentMedications() != null) {
            patient.setCurrentMedications(
                    patientReqDTO.getCurrentMedications()
            );
        }

        if (patientReqDTO.getAddress() != null) {
            patient.setAddress(patientReqDTO.getAddress());
        }

        if (patientReqDTO.getCity() != null) {
            patient.setCity(patientReqDTO.getCity());
        }

        if (patientReqDTO.getState() != null) {
            patient.setState(patientReqDTO.getState());
        }

        if (patientReqDTO.getCountry() != null) {
            patient.setCountry(patientReqDTO.getCountry());
        }

        if (patientReqDTO.getPinCode() != null) {
            patient.setPinCode(patientReqDTO.getPinCode());
        }

        Patient updatedPatient =
                patientRepository.save(patient);

        return modelMapper.map(
                updatedPatient,
                PatientRespDTO.class
        );
    }

    @Override
    @Transactional
    public PatientRespDTO updateMyProfile(User user, PatientReqDTO patientReqDTO) {

        Patient patient = patientRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Patient not found with id: " + user.getUserId()));

        if (patientReqDTO.getGender() != null)
            patient.setGender(patientReqDTO.getGender());

        if (patientReqDTO.getBloodGroup() != null)
            patient.setBloodGroup(patientReqDTO.getBloodGroup());

        if (patientReqDTO.getDateOfBirth() != null)
            patient.setDateOfBirth(patientReqDTO.getDateOfBirth());

        if (patientReqDTO.getHeight() != null && patientReqDTO.getHeight() > 0)
            patient.setHeight(patientReqDTO.getHeight());

        if (patientReqDTO.getWeight() != null && patientReqDTO.getWeight() > 0)
            patient.setWeight(patientReqDTO.getWeight());

        if (patientReqDTO.getAllergies() != null && !patientReqDTO.getAllergies().isBlank())
            patient.setAllergies(patientReqDTO.getAllergies());

        if (patientReqDTO.getMedicalConditions() != null && !patientReqDTO.getMedicalConditions().isBlank())
            patient.setMedicalConditions(patientReqDTO.getMedicalConditions());

        if (patientReqDTO.getCurrentMedications() != null && !patientReqDTO.getCurrentMedications().isBlank())
            patient.setCurrentMedications(patientReqDTO.getCurrentMedications());

        if (patientReqDTO.getAddress() != null && !patientReqDTO.getAddress().isBlank())
            patient.setAddress(patientReqDTO.getAddress());

        if (patientReqDTO.getCity() != null && !patientReqDTO.getCity().isBlank())
            patient.setCity(patientReqDTO.getCity());

        if (patientReqDTO.getState() != null && !patientReqDTO.getState().isBlank())
            patient.setState(patientReqDTO.getState());

        if (patientReqDTO.getCountry() != null && !patientReqDTO.getCountry().isBlank())
            patient.setCountry(patientReqDTO.getCountry());

        if (patientReqDTO.getPinCode() != null && !patientReqDTO.getPinCode().isBlank())
            patient.setPinCode(patientReqDTO.getPinCode());

        Patient updatedPatient = patientRepository.save(patient);

        return modelMapper.map(updatedPatient, PatientRespDTO.class);
    }

    @Override
    public void deletePatient(User user) {
        if(!patientRepository.existsById(user.getUserId())){
            throw new EntityNotFoundException("no patients found with id "+user.getUserId());
        }
        patientRepository.deleteById(user.getUserId());
    }

//    @Override
//    public List<PatientRespDTO> searchPatientbyGender(EnumGender gender) {
//        List<Patient> patients=patientRepository.findByGender(gender);
//        return patients.stream().map(patient -> modelMapper.map(patient, PatientRespDTO.class)).toList();
//    }

    @Override
    public List<PatientRespDTO> getMyPatients(User user) {

        Hospital hospital = hospitalRepository
                .findByUserUserId(user.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Hospital not found"));

        return patientRepository.findByHospitalsContains(hospital)
                .stream()
                .map(patient -> modelMapper.map(patient, PatientRespDTO.class))
                .toList();
    }

    @Override
    public List<PatientRespDTO> filterPatients(
            EnumGender gender,
            EnumBloodGroup bloodGroup,
            String city,
            String state,
            String country,
            String email) {

        User loggedInUser = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Specification<Patient> specification = (root, query, cb) -> cb.conjunction();

        // Hospital can view only its own patients
        if (loggedInUser.getRole().contains(EnumRoles.HOSPITAL)) {

            Hospital hospital = hospitalRepository
                    .findByUserUserId(loggedInUser.getUserId())
                    .orElseThrow(() ->
                            new EntityNotFoundException("Hospital not found"));

            specification = specification.and(
                    PatientSpecification.belongsToHospital(hospital)
            );
        }

        // Admin -> no restriction (can view all patients)

        specification = specification
                .and(PatientSpecification.hasGender(gender))
                .and(PatientSpecification.hasBloodGroup(bloodGroup))
                .and(PatientSpecification.hasCity(city))
                .and(PatientSpecification.hasState(state))
                .and(PatientSpecification.hasCountry(country))
                .and(PatientSpecification.hasEmail(email));

        List<Patient> patients = patientRepository.findAll(specification);

        return patients.stream()
                .map(patient -> modelMapper.map(patient, PatientRespDTO.class))
                .toList();
    }


    @Override
    public InsuranceRespDTO getMyInsurance(User user) {

        Insurance insurance = insuranceRepository
                .findByPatient_User_UserId(user.getUserId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Insurance not found!!")
                );

        return modelMapper.map(
                insurance,
                InsuranceRespDTO.class
        );
    }


}
