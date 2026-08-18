package com.example.Lifelink.Repository;

import com.example.Lifelink.Entity.Hospital;
import com.example.Lifelink.Entity.Patient;
import com.example.Lifelink.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long>,
        JpaSpecificationExecutor<Patient> {

    boolean existsByUser(User user);

    List<Patient> findByHospitalsContains(Hospital hospital);

    List<Patient> findByPatientNameContainingIgnoreCaseAndHospitalsContains(
            String patientName,
            Hospital hospital
    );

    Optional<Patient> findByUserUsername(String username);

    Optional<Patient> findByUserUserId(Long userId);

    Optional<Patient> findByPatientIdAndHospitalsContains(
            Long patientId,
            Hospital hospital
    );
}