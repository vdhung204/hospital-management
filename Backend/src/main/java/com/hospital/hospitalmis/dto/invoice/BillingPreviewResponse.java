package com.hospital.hospitalmis.dto.invoice;

import java.util.List;

public class BillingPreviewResponse {

    private Long encounterId;

    private Long patientId;
    private String patientCode;
    private String patientName;

    private List<ServiceUsageItem> services;

    public Long getEncounterId() { return encounterId; }
    public void setEncounterId(Long encounterId) { this.encounterId = encounterId; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientCode() { return patientCode; }
    public void setPatientCode(String patientCode) { this.patientCode = patientCode; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public List<ServiceUsageItem> getServices() { return services; }
    public void setServices(List<ServiceUsageItem> services) { this.services = services; }
}
