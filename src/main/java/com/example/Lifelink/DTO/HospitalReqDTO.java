package com.example.Lifelink.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HospitalReqDTO {

    private String hospitalName;

    private String email;

    private String phone;

    private String address;

    private String city;

    private String state;

    private Double longitude;

    private Double latitude;

    private String licenseNumber;
}
