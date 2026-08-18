package com.example.Lifelink.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "emergency_contacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyContacts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contactId;


    private String contactName;


    private String relationship;


    private String phone;


    private String email;


    private Integer priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
}