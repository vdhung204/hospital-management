package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.ClinicalNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClinicalNoteRepository extends JpaRepository<ClinicalNote, Long> {

    // Lấy tất cả note theo encounter
    List<ClinicalNote> findByEncounter_IdOrderByCreatedAtAsc(Long encounterId);
}
