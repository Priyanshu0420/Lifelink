package com.example.Lifelink.Service;

import com.example.Lifelink.DTO.EmergencyContactReqDTO;
import com.example.Lifelink.DTO.EmergencyContactRespDTO;
import com.example.Lifelink.Entity.EmergencyContacts;
import com.example.Lifelink.Entity.User;

import java.util.List;

public interface EmergencyContactService {

    EmergencyContactRespDTO addContact(User user, EmergencyContactReqDTO emergencyContactReqDTO);

    EmergencyContactRespDTO updateContactDetails(User user ,Long contactId,EmergencyContactReqDTO emergencyContactReqDTO);

    List<EmergencyContactRespDTO> getMyContact(User user);

    void deleteContact(User user,Long contactId);

}
