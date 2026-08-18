package com.example.Lifelink.Repository;

import com.example.Lifelink.Entity.Insurance;
import com.example.Lifelink.Entity.Patient;
import com.example.Lifelink.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InsuranceRepository extends JpaRepository<Insurance,Long> {
    Optional<Insurance> findByPatient_User_UserId(Long userId);
}
