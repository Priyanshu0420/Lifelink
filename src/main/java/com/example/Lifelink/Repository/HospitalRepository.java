package com.example.Lifelink.Repository;

import com.example.Lifelink.Entity.Hospital;
import com.example.Lifelink.Entity.Patient;
import com.example.Lifelink.Type.EnumHospitalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HospitalRepository extends JpaRepository<Hospital,Long> {

    List<Hospital> findByHospitalNameIgnoreCase(String hospitalName);

    Optional<Hospital> findByUserUserId(Long userId);

    List<Hospital> findByStatus(EnumHospitalStatus status);
}
