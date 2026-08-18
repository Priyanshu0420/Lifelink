package com.example.Lifelink.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QRCodeRespDTO {

    private Long qrId;

    private Long patientId;

    private String qrValue;

    private String imagePath;

    private LocalDateTime generatedAt;
}