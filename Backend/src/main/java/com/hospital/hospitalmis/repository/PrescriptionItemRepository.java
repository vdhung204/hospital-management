package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.PrescriptionItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Long> {

    List<PrescriptionItem> findByPrescription_Id(Long prescriptionId);
}
