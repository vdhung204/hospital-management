package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.entity.*;
import com.hospital.hospitalmis.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@Transactional
public class InventoryService {
    private final DrugBatchRepository drugBatchRepository;
    private final StockTransactionRepository stockTransactionRepository;

    public InventoryService(DrugBatchRepository drugBatchRepository, StockTransactionRepository stockTransactionRepository) {
        this.drugBatchRepository = drugBatchRepository;
        this.stockTransactionRepository = stockTransactionRepository;
    }

    // Hàm nhập kho đơn giản (Import Stock)
    public void importStock(Long drugBatchId, int quantity, String note) {
        DrugBatch batch = drugBatchRepository.findById(drugBatchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        if (quantity <= 0) throw new RuntimeException("Quantity must be > 0");

        // 1. Tăng tồn kho
        batch.setQuantityOnHand(batch.getQuantityOnHand() + quantity);
        drugBatchRepository.save(batch);

        // 2. Ghi log Transaction IN
        StockTransaction tx = new StockTransaction();
        tx.setDrugBatch(batch);
        tx.setTxnType("IN");         // Loại IN
        tx.setQuantity(quantity);    // Số lượng dương
        tx.setTxnTime(LocalDateTime.now());
        tx.setReferenceType("MANUAL_IMPORT");

        stockTransactionRepository.save(tx);
    }
}