package com.example.Lifelink.Service.ServicesImplementation;


import com.example.Lifelink.DTO.EmergencyContactReqDTO;
import com.example.Lifelink.DTO.EmergencyContactRespDTO;
import com.example.Lifelink.Entity.EmergencyContacts;
import com.example.Lifelink.Entity.Patient;
import com.example.Lifelink.Entity.User;
import com.example.Lifelink.Repository.EmergencyContactRepository;
import com.example.Lifelink.Repository.PatientRepository;
import com.example.Lifelink.Service.EmergencyContactService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmergencyContactServiceImpl implements EmergencyContactService {

    private final ModelMapper modelMapper;
    private final EmergencyContactRepository emergencyContactRepository;
    private final PatientRepository patientRepository;

    @Override
    public EmergencyContactRespDTO addContact(User user, EmergencyContactReqDTO emergencyContactReqDTO) {
        Patient patient = patientRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        if (patient.getEmergencyContacts().size() >= 3) {
            throw new RuntimeException("Maximum 3 emergency contacts are allowed.");
        }
        EmergencyContacts emergencyContacts=modelMapper.map(emergencyContactReqDTO, EmergencyContacts.class);
        emergencyContacts.setPatient(patient);
        patient.getEmergencyContacts().add(emergencyContacts);
        return modelMapper.map(emergencyContactRepository.save(emergencyContacts), EmergencyContactRespDTO.class);
    }

    @Override
    public EmergencyContactRespDTO updateContactDetails(User user,Long contactID, EmergencyContactReqDTO emergencyContactReqDTO) {
        EmergencyContacts emergencyContacts = emergencyContactRepository.findById(contactID)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        if(emergencyContactReqDTO.getContactName() !=null){
            emergencyContacts.setContactName(emergencyContactReqDTO.getContactName());
        }
        if(emergencyContactReqDTO.getEmail() !=null){
            emergencyContacts.setEmail(emergencyContactReqDTO.getEmail());
        }
        if(emergencyContactReqDTO.getPhone() !=null){
            emergencyContacts.setPhone(emergencyContactReqDTO.getPhone());
        }
        if(emergencyContactReqDTO.getRelationship() != null){
            emergencyContacts.setRelationship(emergencyContactReqDTO.getRelationship());
        }
        if(emergencyContactReqDTO.getPriority() !=null){
            emergencyContacts.setPriority(emergencyContactReqDTO.getPriority());
        }
        EmergencyContacts updatedContacts=emergencyContactRepository.save(emergencyContacts);

        return modelMapper.map(updatedContacts, EmergencyContactRespDTO.class);
    }

    @Override
    public List<EmergencyContactRespDTO> getMyContact(User user) {
        Patient patient = patientRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return emergencyContactRepository.findByPatient(patient)
                .stream()
                .map(contact -> modelMapper.map(contact, EmergencyContactRespDTO.class))
                .toList();
    }

    @Override
    public void deleteContact(User user,Long contactID) {
        if(!emergencyContactRepository.existsById(contactID)){
            throw new EntityNotFoundException("no Contact found!! ");
        }
        emergencyContactRepository.deleteById(contactID);

    }
}
