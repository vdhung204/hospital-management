package com.hospital.hospitalmis.dto.pharmacy;

public class DispenseItemCreateRequest {

    private Long drugBatchId;
    private Integer quantity;

    public Long getDrugBatchId() { return drugBatchId; }
    public void setDrugBatchId(Long drugBatchId) { this.drugBatchId = drugBatchId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
