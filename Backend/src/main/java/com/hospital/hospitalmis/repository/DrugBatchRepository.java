package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.DrugBatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DrugBatchRepository extends JpaRepository<DrugBatch, Long> {

    // Lấy tất cả lô theo 1 thuốc, sort HSD tăng dần
    List<DrugBatch> findByDrugIdOrderByExpiryDateAsc(Long drugId);

    // (option) kiểm tra trùng số lô cho 1 thuốc
    boolean existsByDrugIdAndBatchNumber(Long drugId, String batchNumber);
}
