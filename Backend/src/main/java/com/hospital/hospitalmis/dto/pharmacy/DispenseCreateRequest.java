package com.hospital.hospitalmis.dto.pharmacy;

import java.util.List;

public class DispenseCreateRequest {

    private Long prescriptionId;
    private Long pharmacistId; // tạm cho FE gửi; sau này có thể lấy từ SecurityContext

    private List<DispenseItemCreateRequest> items;

    public Long getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }

    public Long getPharmacistId() { return pharmacistId; }
    public void setPharmacistId(Long pharmacistId) { this.pharmacistId = pharmacistId; }

    public List<DispenseItemCreateRequest> getItems() { return items; }
    public void setItems(List<DispenseItemCreateRequest> items) { this.items = items; }
}
