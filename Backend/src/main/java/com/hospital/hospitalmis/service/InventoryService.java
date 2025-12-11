package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.entity.*;
import com.hospital.hospitalmis.repository.*;
import com.hospital.hospitalmis.dto.inventory.StockImportRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class InventoryService {
    private final DrugBatchRepository drugBatchRepository;
    private final DrugRepository drugRepository;
    private final StockTransactionRepository stockTransactionRepository;

    public InventoryService(DrugBatchRepository drugBatchRepository,
                            StockTransactionRepository stockTransactionRepository,
                            DrugRepository drugRepository) {
        this.drugBatchRepository = drugBatchRepository;
        this.stockTransactionRepository = stockTransactionRepository;
        this.drugRepository = drugRepository;
    }

    public void createImport(StockImportRequest req) {
        // 1. Validate số lượng
        if (req.getQuantity() == null || req.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be > 0");
        }
        Drug drug = drugRepository.findById(req.getDrugId())
                .orElseThrow(() -> new RuntimeException("Drug not found"));

        // 2. Tìm xem Số Lô này đã có trong hệ thống chưa?
        List<DrugBatch> existingBatches = drugBatchRepository.findByDrugIdAndBatchNumber(
                req.getDrugId(),
                req.getBatchNumber()
        );

        DrugBatch batchToSave = null;

        if (existingBatches.isEmpty()) {
            // TRƯỜNG HỢP 1: Lô này hoàn toàn mới -> Tạo mới (Happy Case)
            batchToSave = new DrugBatch();
            batchToSave.setDrug(drug);
            batchToSave.setBatchNumber(req.getBatchNumber());
            batchToSave.setExpiryDate(req.getExpiryDate());
            batchToSave.setQuantityOnHand(req.getQuantity());
            batchToSave.setIsDeleted(false);
        } else {
            // Lô đã tồn tại, kiểm tra Hạn Sử Dụng
            // Giả sử logic là: 1 số lô chỉ được phép có 1 hạn dùng duy nhất
            DrugBatch existing = existingBatches.get(0); // Lấy lô cũ ra

            if (existing.getExpiryDate().isEqual(req.getExpiryDate())) {
                // TRƯỜNG HỢP 2: Trùng Lô + Trùng Hạn -> Cộng dồn (Happy Case)
                existing.setQuantityOnHand(existing.getQuantityOnHand() + req.getQuantity());
                batchToSave = existing;
            } else {
                // TRƯỜNG HỢP 3: Trùng Lô + KHÁC Hạn -> BÁO LỖI (Validation Case)
                // Đây chính là chỗ chặn nhập sai hoặc hàng giả như bạn muốn
                throw new RuntimeException(
                        "Mâu thuẫn dữ liệu! Lô " + req.getBatchNumber() +
                                " đã tồn tại với HSD " + existing.getExpiryDate() +
                                ". Bạn đang nhập HSD " + req.getExpiryDate() +
                                ". Vui lòng kiểm tra lại thực tế!"
                );
            }
        }

        // 3. Lưu và ghi log
        DrugBatch savedBatch = drugBatchRepository.save(batchToSave);

        StockTransaction tx = new StockTransaction();
        tx.setDrugBatch(savedBatch);
        tx.setTxnType("IN");
        tx.setQuantity(req.getQuantity());
        tx.setTxnTime(LocalDateTime.now());
        tx.setReferenceType("IMPORT");
        tx.setDetails(req.getNote());

        stockTransactionRepository.save(tx);
    }
}