package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.ClinicalOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ClinicalOrderRepository extends JpaRepository<ClinicalOrder, Long> {
    List<ClinicalOrder> findByEncounter_Id(Long encounterId);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
