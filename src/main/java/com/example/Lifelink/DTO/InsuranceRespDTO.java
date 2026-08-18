package com.example.Lifelink.DTO;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InsuranceRespDTO {

    private Long insuranceId;

    private Long patientId;

    private String providerName;

    private String policyNumber;

    private String policyType;

    private LocalDate startDate;

    private LocalDate expiryDate;

    private String coverageDetails;

    private String status;
}