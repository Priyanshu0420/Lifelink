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
public class PatientSignupReqDTO {

    @NotBlank(message = "Full name is required")
    private String name;

    @Email(message = "Invalid username")
    @NotBlank(message = "Email is required")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must contain at least 8 characters")
    private String password;


}
