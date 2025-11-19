package com.hospital.hospitalmis.dto.clinical_result;

import java.time.LocalDateTime;
import java.util.List;

public class ClinicalOrderResponse {

    private Long id;
    private Long encounterId;
    private Long orderedBy;
    private String status;
    private LocalDateTime createdAt;
    private List<ClinicalOrderItemResponse> items;

    // getters/setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEncounterId() {
        return encounterId;
    }

    public void setEncounterId(Long encounterId) {
        this.encounterId = encounterId;
    }

    public Long getOrderedBy() {
        return orderedBy;
    }

    public void setOrderedBy(Long orderedBy) {
        this.orderedBy = orderedBy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<ClinicalOrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<ClinicalOrderItemResponse> items) {
        this.items = items;
    }
}
