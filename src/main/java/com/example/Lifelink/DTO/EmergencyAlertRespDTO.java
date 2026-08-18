package com.example.Lifelink.DTO;

import com.example.Lifelink.Type.EnumAlert;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyAlertRespDTO {

    private Long alertId;

    private String patientName;

    private String hospitalName;

    private LocalDateTime scanTime;

    private Double latitude;

    private Double longitude;

    private EnumAlert status;

    private String message;
}
