package com.hospital.hospitalmis.dto.prescribe;

import java.util.List;

public class DrugBatchAllocationResultDto {

    private Long drugId;
    private String drugCode;
    private String drugName;

    private Integer requestedQuantity; // số lượng yêu cầu
    private Integer totalAllocated;    // tổng số lượng phân bổ được
    private boolean enoughStock;      // có đủ tồn kho không

    private List<DrugBatchAllocationItemDto> items;

    // getters/setters
    public Long getDrugId() { return drugId; }
    public void setDrugId(Long drugId) { this.drugId = drugId; }

    public String getDrugCode() { return drugCode; }
    public void setDrugCode(String drugCode) { this.drugCode = drugCode; }

    public String getDrugName() { return drugName; }
    public void setDrugName(String drugName) { this.drugName = drugName; }

    public Integer getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(Integer requestedQuantity) { this.requestedQuantity = requestedQuantity; }

    public Integer getTotalAllocated() { return totalAllocated; }
    public void setTotalAllocated(Integer totalAllocated) { this.totalAllocated = totalAllocated; }

    public boolean isEnoughStock() { return enoughStock; }
    public void setEnoughStock(boolean enoughStock) { this.enoughStock = enoughStock; }

    public List<DrugBatchAllocationItemDto> getItems() { return items; }
    public void setItems(List<DrugBatchAllocationItemDto> items) { this.items = items; }
}
