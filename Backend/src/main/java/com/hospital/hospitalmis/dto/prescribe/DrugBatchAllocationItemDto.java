package com.hospital.hospitalmis.dto.prescribe;

import java.time.LocalDate;

public class DrugBatchAllocationItemDto {

    private Long batchId;
    private String batchNumber;
    private LocalDate expiryDate;

    private Integer quantityOnHand; // tồn kho hiện tại của lô
    private Integer allocatedQuantity; // số lượng đề xuất lấy từ lô này

    // getters/setters
    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public Integer getQuantityOnHand() { return quantityOnHand; }
    public void setQuantityOnHand(Integer quantityOnHand) { this.quantityOnHand = quantityOnHand; }

    public Integer getAllocatedQuantity() { return allocatedQuantity; }
    public void setAllocatedQuantity(Integer allocatedQuantity) { this.allocatedQuantity = allocatedQuantity; }
}
