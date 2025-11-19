package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.EncounterDiagnosis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EncounterDiagnosisRepository extends JpaRepository<EncounterDiagnosis, Long> {

    List<EncounterDiagnosis> findByEncounter_Id(Long encounterId);
}
