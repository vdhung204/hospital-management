package com.hospital.hospitalmis.dto.prescribe;

public class DrugBatchAllocationRequest {

    private Long drugId;
    private Integer quantity; // số lượng cần cấp

    public Long getDrugId() {
        return drugId;
    }

    public void setDrugId(Long drugId) {
        this.drugId = drugId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
