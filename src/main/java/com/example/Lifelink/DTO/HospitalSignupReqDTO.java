package com.example.Lifelink.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalSignupReqDTO {

    @NotBlank(message = "Full name is required")
    private String name;

    @Email(message = "Invalid email")
    @NotBlank(message = "username is required")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must contain at least 8 characters")
    private String password;

    @NotBlank(message = "License Number is required")
    private String licenseNumber;


}
