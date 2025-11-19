package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.LabResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LabResultRepository extends JpaRepository<LabResult, Long> {
    List<LabResult> findByClinicalOrderItem_Id(Long orderItemId);
}
