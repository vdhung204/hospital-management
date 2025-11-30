package com.hospital.hospitalmis.dto.inventory;

import java.time.LocalDate;

public class StockImportRequest {
    private Long drugId;         // Nhập thuốc gì
    private String batchNumber;  // Số lô (nếu lô mới thì tạo mới, lô cũ thì cộng dồn)
    private LocalDate expiryDate;// Hạn sử dụng
    private Integer quantity;    // Số lượng nhập
    private String note;         // Ghi chú (Nhập từ đâu...)

    // Getters and Setters
    public Long getDrugId() { return drugId; }
    public void setDrugId(Long drugId) { this.drugId = drugId; }
    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}