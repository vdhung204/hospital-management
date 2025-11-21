package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Dispense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DispenseRepository extends JpaRepository<Dispense, Long> {

    List<Dispense> findByPrescriptionId(Long prescriptionId);
}
