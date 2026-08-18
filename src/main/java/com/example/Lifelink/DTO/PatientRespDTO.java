package com.example.Lifelink.DTO;

import com.example.Lifelink.Type.EnumBloodGroup;
import com.example.Lifelink.Type.EnumGender;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientRespDTO {

    private Long patientId;

    private EnumGender gender;

    private EnumBloodGroup bloodGroup;

    private LocalDate dateOfBirth;

    private Double height;

    private Double weight;

    private String allergies;

    private String medicalConditions;

    private String currentMedications;

    private String address;

    private String city;

    private String state;

    private String country;

    private String pinCode;
}