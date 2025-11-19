package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Encounter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EncounterRepository extends JpaRepository<Encounter, Long> {

    // Lấy lịch sử khám theo bệnh nhân
    List<Encounter> findByPatient_Id(Long patientId);
}
