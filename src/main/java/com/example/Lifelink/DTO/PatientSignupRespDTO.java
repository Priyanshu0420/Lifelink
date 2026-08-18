package com.example.Lifelink.DTO;

import com.example.Lifelink.Type.EnumRoles;
import lombok.*;
import org.hibernate.annotations.CurrentTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientSignupRespDTO {
    private Long userId;

    private String name;

    private String email;

    private EnumRoles role;

    private boolean enabled;

    @CurrentTimestamp
    private LocalDateTime createdAt;

}
