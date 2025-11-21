package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByPatientCode(String patientCode);
    @Query("select coalesce(max(p.id), 0) from Patient p")
    Long findMaxId();
}
