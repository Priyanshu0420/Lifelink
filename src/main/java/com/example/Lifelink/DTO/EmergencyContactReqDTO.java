package com.example.Lifelink.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmergencyContactReqDTO {

    @NotBlank(message = "Contact name is required")
    private String contactName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Relationship is required")
    private String relationship;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Priority is required")
    @Positive(message = "Priority must be greater than 0")
    private Integer priority;
}