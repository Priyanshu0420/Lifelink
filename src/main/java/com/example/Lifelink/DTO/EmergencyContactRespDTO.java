package com.example.Lifelink.DTO;

import jakarta.persistence.Column;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmergencyContactRespDTO {

    private Long contactId;

    private String contactName;

    private String phone;

    private String relationship;

    private String email;

    private Integer priority;
}