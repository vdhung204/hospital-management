package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.ImagingResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImagingResultRepository extends JpaRepository<ImagingResult, Long> {
    List<ImagingResult> findByClinicalOrderItem_Id(Long orderItemId);
}
