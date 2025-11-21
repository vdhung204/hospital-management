package com.hospital.hospitalmis.dto.master;

import java.time.LocalDate;

public class DrugBatchRequest {

    private Long drugId;
    private String batchNumber;
    private LocalDate expiryDate;
    private Integer quantityOnHand;

    // ===== getters / setters =====
    public Long getDrugId() { return drugId; }
    public void setDrugId(Long drugId) { this.drugId = drugId; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public Integer getQuantityOnHand() { return quantityOnHand; }
    public void setQuantityOnHand(Integer quantityOnHand) { this.quantityOnHand = quantityOnHand; }
}
