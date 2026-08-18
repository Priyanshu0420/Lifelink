package com.example.Lifelink.DTO;

import com.example.Lifelink.Type.EnumAlert;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateEmergencyStatusDTO {

    private EnumAlert status;
}