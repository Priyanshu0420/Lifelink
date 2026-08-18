package com.example.Lifelink.Service.ServicesImplementation;

import com.example.Lifelink.DTO.HospitalEmergencyRespDTO;
import com.example.Lifelink.DTO.HospitalReqDTO;
import com.example.Lifelink.DTO.HospitalRespDTO;
import com.example.Lifelink.DTO.UpdateEmergencyStatusDTO;
import com.example.Lifelink.Entity.EmergencyAlert;
import com.example.Lifelink.Entity.Hospital;
import com.example.Lifelink.Entity.Patient;
import com.example.Lifelink.Entity.User;
import com.example.Lifelink.Repository.EmergencyAlertRepository;
import com.example.Lifelink.Repository.HospitalRepository;
import com.example.Lifelink.Service.HospitalService;
import com.example.Lifelink.Type.EnumAlert;
import com.example.Lifelink.Type.EnumHospitalStatus;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import com.example.Lifelink.Repository.PatientRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final ModelMapper modelMapper;
    private final EmergencyAlertRepository emergencyAlertRepository;
    private final PatientRepository patientRepository;

    @Override
    public HospitalRespDTO createHospital(HospitalReqDTO hospitalReqDTO) {
        Hospital hospital = modelMapper.map(hospitalReqDTO, Hospital.class);

        hospital = hospitalRepository.save(hospital);

        return modelMapper.map(hospital, HospitalRespDTO.class);
    }

    @Override
    public HospitalRespDTO updateMyProfile(
            HospitalReqDTO hospitalReqDTO,
            User user) {

        Hospital hospital = hospitalRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Hospital not found"));

        if (hospital.getStatus() != EnumHospitalStatus.Approved) {
            throw new AccessDeniedException(
                    "Your hospital registration is still pending approval.");
        }

        if (hospitalReqDTO.getHospitalName() != null) {
            hospital.setHospitalName(hospitalReqDTO.getHospitalName());
        }

        if (hospitalReqDTO.getEmail() != null) {
            hospital.setEmail(hospitalReqDTO.getEmail());
        }

        if (hospitalReqDTO.getPhone() != null) {
            hospital.setPhone(hospitalReqDTO.getPhone());
        }

        if (hospitalReqDTO.getAddress() != null) {
            hospital.setAddress(hospitalReqDTO.getAddress());
        }

        if (hospitalReqDTO.getCity() != null) {
            hospital.setCity(hospitalReqDTO.getCity());
        }

        if (hospitalReqDTO.getState() != null) {
            hospital.setState(hospitalReqDTO.getState());
        }

        if (hospitalReqDTO.getLatitude() != null) {
            hospital.setLatitude(hospitalReqDTO.getLatitude());
        }

        if (hospitalReqDTO.getLongitude() != null) {
            hospital.setLongitude(hospitalReqDTO.getLongitude());
        }

        if (hospitalReqDTO.getLicenseNumber() != null) {
            hospital.setLicenseNumber(hospitalReqDTO.getLicenseNumber());
        }

        hospital = hospitalRepository.save(hospital);

        return modelMapper.map(hospital, HospitalRespDTO.class);
    }

    @Override
    public void deleteHospital(User user) {


        if (!hospitalRepository.existsById(user.getUserId())) {
            throw new IllegalArgumentException(
                    "Hospital not found with id: " + user.getUserId());
        }

        hospitalRepository.deleteById(user.getUserId());
    }

    @Override
    public List<HospitalRespDTO> searchHospital(String hospitalName) {

        List<Hospital> hospitals =
                hospitalRepository.findByHospitalNameIgnoreCase(hospitalName);


        return hospitals.stream()
                .map(hospital ->
                        modelMapper.map(hospital, HospitalRespDTO.class))
                .toList();
    }

    @Override
    public List<HospitalRespDTO> getAllHospitals() {

        return hospitalRepository.findAll()
                .stream()
                .map(hospital ->
                        modelMapper.map(hospital, HospitalRespDTO.class))
                .toList();
    }

    @Override
    public HospitalRespDTO getHospitalById(Long hospitalId) {

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Hospital not found with id: " + hospitalId));
        if (hospital.getStatus() != EnumHospitalStatus.Approved) {
            throw new AccessDeniedException(
                    "Your hospital registration is still pending approval.");
        }

        return modelMapper.map(hospital, HospitalRespDTO.class);
    }

    @Override
    public HospitalRespDTO getMyProfile(User user) {

        Hospital hospital = hospitalRepository.findById(user.getUserId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Hospital not found with id: " + user.getUserId()));
        if (hospital.getStatus() != EnumHospitalStatus.Approved) {
            throw new AccessDeniedException(
                    "Your hospital registration is still pending approval.");
        }

        return modelMapper.map(hospital, HospitalRespDTO.class);
    }

    @Override
    public void approveHospital(Long hospitalId) {

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Hospital not found with ID: " + hospitalId));

        if (hospital.getStatus() != EnumHospitalStatus.Pending) {
            throw new IllegalStateException(
                    "Only pending hospitals can be approved.");
        }

        hospital.setStatus(EnumHospitalStatus.Approved);

        hospitalRepository.save(hospital);
    }

    @Override
    public void rejectHospital(Long hospitalId) {

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Hospital not found with ID: " + hospitalId));

        if (hospital.getStatus() != EnumHospitalStatus.Pending) {
            throw new IllegalStateException(
                    "Only pending hospitals can be rejected.");
        }

        hospital.setStatus(EnumHospitalStatus.Rejected);

        hospitalRepository.save(hospital);
    }

    @Override
    public List<HospitalEmergencyRespDTO> getTodaysEmergencies(User user) {

        Hospital hospital = hospitalRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Hospital not found")
                );

        if (hospital.getStatus() != EnumHospitalStatus.Approved) {
            throw new AccessDeniedException(
                    "Your hospital registration is not approved."
            );
        }

        LocalDateTime startOfDay =
                LocalDate.now().atStartOfDay();

        LocalDateTime endOfDay =
                LocalDate.now().plusDays(1).atStartOfDay();

        return emergencyAlertRepository
                .findByHospitalAndScanTimeBetween(
                        hospital,
                        startOfDay,
                        endOfDay
                )
                .stream()
                .map(this::mapEmergencyToDTO)
                .toList();
    }

    @Override
    public HospitalEmergencyRespDTO getEmergencyById(
            Long alertId,
            User user
    ) {

        Hospital hospital = hospitalRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Hospital not found")
                );

        if (hospital.getStatus() != EnumHospitalStatus.Approved) {
            throw new AccessDeniedException(
                    "Your hospital registration is not approved."
            );
        }

        EmergencyAlert alert =
                emergencyAlertRepository
                        .findByAlertIdAndHospital(alertId, hospital)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Emergency alert not found"
                                )
                        );

        return mapEmergencyToDTO(alert);
    }

    @Override
    @Transactional
    public HospitalEmergencyRespDTO updateEmergencyStatus(
            Long alertId,
            UpdateEmergencyStatusDTO request,
            User user
    ) {

        Hospital hospital = hospitalRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Hospital not found")
                );

        if (hospital.getStatus() != EnumHospitalStatus.Approved) {
            throw new AccessDeniedException(
                    "Your hospital registration is not approved."
            );
        }

        EmergencyAlert alert =
                emergencyAlertRepository
                        .findByAlertIdAndHospital(alertId, hospital)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Emergency alert not found"
                                )
                        );

        EnumAlert currentStatus = alert.getStatus();
        EnumAlert newStatus = request.getStatus();

        // =====================================================
        // ACCEPT EMERGENCY
        // =====================================================

        if (currentStatus == EnumAlert.PENDING &&
                newStatus == EnumAlert.ACCEPTED) {

            alert.setStatus(EnumAlert.ACCEPTED);

            // Get the patient from this emergency
            Patient patient = alert.getPatient();

            // Connect patient with this hospital
            if (!patient.getHospitals().contains(hospital)) {

                patient.getHospitals().add(hospital);

                patientRepository.save(patient);
            }

        }

        // =====================================================
        // RESOLVE EMERGENCY
        // =====================================================

        else if (currentStatus == EnumAlert.ACCEPTED &&
                newStatus == EnumAlert.RESOLVED) {

            alert.setStatus(EnumAlert.RESOLVED);

        }

        // =====================================================
        // INVALID TRANSITION
        // =====================================================

        else {

            throw new IllegalStateException(
                    "Invalid status transition: "
                            + currentStatus
                            + " -> "
                            + newStatus
            );
        }

        EmergencyAlert savedAlert =
                emergencyAlertRepository.save(alert);

        return mapEmergencyToDTO(savedAlert);
    }

    @Override
    public List<HospitalEmergencyRespDTO> getEmergencyHistory(User user) {

        Hospital hospital = hospitalRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Hospital not found")
                );

        if (hospital.getStatus() != EnumHospitalStatus.Approved) {
            throw new AccessDeniedException(
                    "Your hospital registration is not approved."
            );
        }

        return emergencyAlertRepository
                .findByHospitalOrderByScanTimeDesc(hospital)
                .stream()
                .map(this::mapEmergencyToDTO)
                .toList();
    }

    private HospitalEmergencyRespDTO mapEmergencyToDTO(EmergencyAlert alert) {

        Patient patient = alert.getPatient();

        return HospitalEmergencyRespDTO.builder()
                .alertId(alert.getAlertId()) // ADD THIS
                .patientName(patient.getPatientName())
                .bloodGroup(
                        patient.getBloodGroup() != null
                                ? patient.getBloodGroup().name()
                                : null
                )
                .allergies(patient.getAllergies())
                .medicalConditions(patient.getMedicalConditions())
                .phone(patient.getPhone())
                .scanTime(alert.getScanTime())
                .latitude(alert.getLatitude())
                .longitude(alert.getLongitude())
                .status(alert.getStatus())
                .build();
    }
}