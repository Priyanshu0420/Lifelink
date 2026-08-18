package com.example.Lifelink.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginReqDTO {

    @Email(message = "Invalid email")
    @NotBlank(message = "email is required!!")
    private String username;

    @NotBlank(message = "password is required!!")
    private String password;
}
