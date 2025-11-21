package com.hospital.hospitalmis.dto.pharmacy;

import java.time.LocalDateTime;
import java.util.List;

public class DispenseDetailDto {

    private Long id;
    private Long prescriptionId;
    private Long pharmacistId;
    private String pharmacistName; // nếu anh muốn hiển thị tên

    private LocalDateTime dispensedAt;
    private String status;

    private List<DispenseItemDto> items;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }

    public Long getPharmacistId() { return pharmacistId; }
    public void setPharmacistId(Long pharmacistId) { this.pharmacistId = pharmacistId; }

    public String getPharmacistName() { return pharmacistName; }
    public void setPharmacistName(String pharmacistName) { this.pharmacistName = pharmacistName; }

    public LocalDateTime getDispensedAt() { return dispensedAt; }
    public void setDispensedAt(LocalDateTime dispensedAt) { this.dispensedAt = dispensedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<DispenseItemDto> getItems() { return items; }
    public void setItems(List<DispenseItemDto> items) { this.items = items; }
}
