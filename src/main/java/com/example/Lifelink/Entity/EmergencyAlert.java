package com.example.Lifelink.Entity;

import com.example.Lifelink.Type.EnumAlert;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.CurrentTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "emergency_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @CurrentTimestamp
    private LocalDateTime scanTime;


    private Double latitude;


    private Double longitude;


    @Enumerated(EnumType.STRING)
    private EnumAlert status;

    @Column(length = 1000)
    private String notes;

    @OneToMany(
            mappedBy = "emergencyAlert",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<NotificationLog> notificationLogs = new ArrayList<>();
}