package com.example.Lifelink.DTO;

import com.example.Lifelink.Type.EnumHospitalStatus;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HospitalRespDTO {

    private Long hospitalId;

    private String hospitalName;

    private String email;

    private String phone;

    private String address;

    private String city;

    private String state;

    private Double longitude;

    private Double latitude;

    private EnumHospitalStatus status;

    private String licenseNumber;
}