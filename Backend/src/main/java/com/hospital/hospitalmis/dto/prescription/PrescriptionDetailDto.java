package com.hospital.hospitalmis.dto.prescription;

import java.time.LocalDateTime;
import java.util.List;

public class PrescriptionDetailDto {

    private Long id;
    private Long encounterId;

    private Long prescriberId;
    private String prescriberName;

    private LocalDateTime createdAt;
    private String status;

    private List<PrescriptionItemDto> items;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEncounterId() { return encounterId; }
    public void setEncounterId(Long encounterId) { this.encounterId = encounterId; }

    public Long getPrescriberId() { return prescriberId; }
    public void setPrescriberId(Long prescriberId) { this.prescriberId = prescriberId; }

    public String getPrescriberName() { return prescriberName; }
    public void setPrescriberName(String prescriberName) { this.prescriberName = prescriberName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<PrescriptionItemDto> getItems() { return items; }
    public void setItems(List<PrescriptionItemDto> items) { this.items = items; }
}
