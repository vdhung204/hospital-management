package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.inventory.StockImportRequest;
import com.hospital.hospitalmis.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // API: Tạo phiếu nhập kho
    // POST /api/inventory/import
    @PostMapping("/import")
    public ResponseEntity<?> importStock(@RequestBody StockImportRequest request) {
        try {
            inventoryService.createImport(request);
            return ResponseEntity.ok("Nhập kho thành công!");
        } catch (RuntimeException e) {
            // Khi Service ném lỗi "Mâu thuẫn dữ liệu...", Controller bắt lại
            // và trả về mã lỗi 400 kèm thông báo để Frontend hiển thị lên màn hình
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}