package com.example.Lifelink.DTO;

import com.example.Lifelink.Type.EnumBloodGroup;
import com.example.Lifelink.Type.EnumGender;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class PatientReqDTO {

    private Long userId;

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

    private String pinCode;

    private String state;

    private String country;
}