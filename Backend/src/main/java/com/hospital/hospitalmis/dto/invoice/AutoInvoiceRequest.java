package com.hospital.hospitalmis.dto.invoice;

public class AutoInvoiceRequest {

    private String payerType;         // CASH / INSURANCE ...
    private Boolean includeConsult;   // Khám
    private Boolean includeLabs;      // Xét nghiệm
    private Boolean includeImaging;   // CĐHA
    private Boolean includeDrugs;     // Thuốc

    private Long insuranceCardId;

    public String getPayerType() { return payerType; }
    public void setPayerType(String payerType) { this.payerType = payerType; }

    public Boolean getIncludeConsult() { return includeConsult; }
    public void setIncludeConsult(Boolean includeConsult) { this.includeConsult = includeConsult; }

    public Boolean getIncludeLabs() { return includeLabs; }
    public void setIncludeLabs(Boolean includeLabs) { this.includeLabs = includeLabs; }

    public Boolean getIncludeImaging() { return includeImaging; }
    public void setIncludeImaging(Boolean includeImaging) { this.includeImaging = includeImaging; }

    public Boolean getIncludeDrugs() { return includeDrugs; }
    public void setIncludeDrugs(Boolean includeDrugs) { this.includeDrugs = includeDrugs; }

    public Long getInsuranceCardId() {
        return insuranceCardId;
    }

    public void setInsuranceCardId(Long insuranceCardId) {
        this.insuranceCardId = insuranceCardId;
    }
}
