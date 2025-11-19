package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    // tất cả đơn của 1 encounter
    List<Prescription> findByEncounter_Id(Long encounterId);
}
