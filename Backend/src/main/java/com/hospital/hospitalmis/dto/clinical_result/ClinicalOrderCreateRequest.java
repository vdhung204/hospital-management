package com.hospital.hospitalmis.dto.clinical_result;

import java.util.List;

public class ClinicalOrderCreateRequest {

    private Long orderedBy; // staff id (bác sĩ)
    private List<ClinicalOrderItemRequest> items;

    public Long getOrderedBy() { return orderedBy; }
    public void setOrderedBy(Long orderedBy) { this.orderedBy = orderedBy; }

    public List<ClinicalOrderItemRequest> getItems() { return items; }
    public void setItems(List<ClinicalOrderItemRequest> items) { this.items = items; }
}
