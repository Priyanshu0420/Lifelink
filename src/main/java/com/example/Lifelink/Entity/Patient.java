package com.example.Lifelink.Entity;

import com.example.Lifelink.Type.EnumBloodGroup;
import com.example.Lifelink.Type.EnumGender;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    private Long patientId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    @MapsId
    private User user;

    private String patientName;

    private String email;

    private String phone;


    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private EnumGender gender;

    @Enumerated(EnumType.STRING)
    private EnumBloodGroup bloodGroup;

    @Column(length = 1000)
    private String allergies;

    @Column(length = 1000)
    private String medicalConditions;

    @Column(length = 1000)
    private String currentMedications;

    private Double height;

    private Double weight;

    private String address;

    private String city;

    private String state;


    private String country;


    private String pinCode;

    @OneToMany(
            mappedBy = "patient",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<EmergencyContacts> emergencyContacts = new ArrayList<>();

    @OneToOne(
            mappedBy = "patient",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private Insurance insurance;

    @OneToOne(
            mappedBy = "patient",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private QRCode qrCode;

    @OneToMany(
            mappedBy = "patient",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<EmergencyAlert> emergencyAlerts = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "patient_hospital",
            joinColumns = @JoinColumn(name = "patient_id"),
            inverseJoinColumns = @JoinColumn(name = "hospital_id")
    )
    @Builder.Default
    private List<Hospital> hospitals = new ArrayList<>();


    @CreationTimestamp
    private LocalDateTime createdAt;
}
