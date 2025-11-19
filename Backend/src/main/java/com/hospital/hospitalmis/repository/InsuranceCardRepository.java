package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.InsuranceCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InsuranceCardRepository extends JpaRepository<InsuranceCard, Long> {
    List<InsuranceCard> findByPatient_Id(Long patientId);
}
