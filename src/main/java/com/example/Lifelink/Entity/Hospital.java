package com.example.Lifelink.Entity;

import com.example.Lifelink.Type.EnumHospitalStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hospitals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {

    @Id
    @Column(name = "user_id")
    private Long hospitalId;

    @Column(nullable = false)
    private String hospitalName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    private String address;

    private String city;


    private String state;


    private Double latitude;


    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnumHospitalStatus status = EnumHospitalStatus.Pending;


    private String licenseNumber;

    @ManyToMany(mappedBy = "hospitals", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Patient> patients = new ArrayList<>();

    @OneToMany(
            mappedBy = "hospital",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<EmergencyAlert> emergencyAlerts = new ArrayList<>();

    @MapsId
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @CreationTimestamp
    private LocalDateTime createdAt;
}
