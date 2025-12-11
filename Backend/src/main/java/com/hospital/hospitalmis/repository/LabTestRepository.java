package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LabTestRepository extends JpaRepository<LabTest, Long> {
    boolean existsByCode(String code);
}
