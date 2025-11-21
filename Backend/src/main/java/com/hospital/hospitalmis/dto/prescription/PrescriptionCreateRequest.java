package com.hospital.hospitalmis.dto.prescription;

import java.util.List;

public class PrescriptionCreateRequest {

    private Long prescriberId; // staff.id, có thể null, sẽ fallback sang encounter.doctor
    private List<PrescriptionItemRequest> items;

    public Long getPrescriberId() { return prescriberId; }
    public void setPrescriberId(Long prescriberId) { this.prescriberId = prescriberId; }

    public List<PrescriptionItemRequest> getItems() { return items; }
    public void setItems(List<PrescriptionItemRequest> items) { this.items = items; }
}
