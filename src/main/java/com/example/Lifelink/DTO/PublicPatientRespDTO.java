package com.example.Lifelink.DTO;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicPatientRespDTO {

    private String name;

    private String bloodGroup;

    private String allergies;

    private String medicalConditions;

    private List<EmergencyContactRespDTO> emergencyContacts;

}
