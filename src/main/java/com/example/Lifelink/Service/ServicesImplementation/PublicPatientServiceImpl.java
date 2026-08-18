package com.example.Lifelink.Service.ServicesImplementation;

import com.example.Lifelink.DTO.PublicPatientRespDTO;
import com.example.Lifelink.Entity.Patient;
import com.example.Lifelink.Repository.PatientRepository;
import com.example.Lifelink.Service.PublicPatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Lifelink.DTO.EmergencyContactRespDTO;
import com.example.Lifelink.Entity.EmergencyContacts;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublicPatientServiceImpl implements PublicPatientService {

    private final PatientRepository patientRepository;

    @Override
    @Transactional(readOnly = true)
    public PublicPatientRespDTO getPublicPatient(Long patientId) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found with ID: " + patientId
                        )
                );

        List<EmergencyContactRespDTO> emergencyContacts =
                patient.getEmergencyContacts()
                        .stream()
                        .map(this::mapEmergencyContact)
                        .toList();

        return PublicPatientRespDTO.builder()
                .name(patient.getPatientName())
                .bloodGroup(
                        patient.getBloodGroup() != null
                                ? patient.getBloodGroup().name()
                                : null
                )
                .allergies(patient.getAllergies())
                .medicalConditions(patient.getMedicalConditions())
                .emergencyContacts(emergencyContacts)
                .build();
    }

    private EmergencyContactRespDTO mapEmergencyContact(
            EmergencyContacts contact
    ) {

        return EmergencyContactRespDTO.builder()
                .contactName(contact.getContactName())
                .relationship(contact.getRelationship())
                .phone(contact.getPhone())
                .email(contact.getEmail())
                .priority(contact.getPriority())
                .build();
    }
}