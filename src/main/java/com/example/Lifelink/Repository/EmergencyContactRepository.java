package com.example.Lifelink.Repository;

import com.example.Lifelink.Entity.EmergencyContacts;
import com.example.Lifelink.Entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmergencyContactRepository extends JpaRepository<EmergencyContacts,Long> {
    List<EmergencyContacts> findByPatient(Patient patient);
    Optional<EmergencyContacts> findByContactIdAndPatientUserUserId(Long contactId, Long userId);
}
