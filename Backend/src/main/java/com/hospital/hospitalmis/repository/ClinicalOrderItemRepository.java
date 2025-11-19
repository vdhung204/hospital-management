package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.ClinicalOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClinicalOrderItemRepository extends JpaRepository<ClinicalOrderItem, Long> {
    List<ClinicalOrderItem> findByClinicalOrder_Id(Long orderId);
    List<ClinicalOrderItem> findByClinicalOrder_Encounter_IdAndItemType(Long encounterId, String itemType);
    List<ClinicalOrderItem> findByClinicalOrder_Encounter_Id(Long encounterId);
}
