package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.ClinicalOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClinicalOrderItemRepository extends JpaRepository<ClinicalOrderItem, Long> {
    List<ClinicalOrderItem> findByClinicalOrder_Id(Long orderId);
    List<ClinicalOrderItem> findByClinicalOrder_Encounter_IdAndItemType(Long encounterId, String itemType);
    List<ClinicalOrderItem> findByClinicalOrder_Encounter_Id(Long encounterId);
    // Lấy danh sách chờ theo loại (LAB_TEST hoặc IMG_PROC) và trạng thái (ORDERED)
    @Query("SELECT i FROM ClinicalOrderItem i " +
            "WHERE i.itemType = :itemType " +
            "AND i.status = 'ORDERED' " +
            "AND i.clinicalOrder.encounter.status = 'IN_PROGRESS'") // Chỉ lấy của ca đang khám
    List<ClinicalOrderItem> findPendingItems(@Param("itemType") String itemType);
}
