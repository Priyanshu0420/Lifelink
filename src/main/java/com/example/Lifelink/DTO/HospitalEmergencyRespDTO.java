package com.example.Lifelink.DTO;

import com.example.Lifelink.Type.EnumAlert;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalEmergencyRespDTO {

    private Long alertId;

    private String patientName;

    private String bloodGroup;

    private String allergies;

    private String medicalConditions;

    private String phone;

    private LocalDateTime scanTime;

    private Double latitude;

    private Double longitude;

    private EnumAlert status;
}
