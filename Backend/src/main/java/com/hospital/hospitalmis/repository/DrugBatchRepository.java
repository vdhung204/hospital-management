package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.DrugBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DrugBatchRepository extends JpaRepository<DrugBatch, Long> {

    // Lấy tất cả lô theo 1 thuốc, sort HSD tăng dần
    List<DrugBatch> findByDrugIdOrderByExpiryDateAsc(Long drugId);

    // (option) kiểm tra trùng số lô cho 1 thuốc
    boolean existsByDrugIdAndBatchNumber(Long drugId, String batchNumber);

    List<DrugBatch> findByDrugIdAndBatchNumber(Long drugId, String batchNumber);

    // Đếm số lô thuốc có tồn kho dưới :threshold
    @Query("SELECT COUNT(b) FROM DrugBatch b WHERE b.quantityOnHand < :threshold AND b.isDeleted = false")
    Long countLowStock(@Param("threshold") Integer threshold);
}
