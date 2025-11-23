package com.hospital.hospitalmis.dto.invoice;

import java.math.BigDecimal;
import java.util.List;

public class InvoiceCreateRequest {

    private Long patientId;
    private Long encounterId;   // có thể null
    private String payerType;
    private BigDecimal discount; // tổng chiết khấu (nếu có)
    private List<InvoiceLineRequest> lines;

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getEncounterId() { return encounterId; }
    public void setEncounterId(Long encounterId) { this.encounterId = encounterId; }

    public String getPayerType() {
        return payerType;
    }

    public void setPayerType(String payerType) {
        this.payerType = payerType;
    }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public List<InvoiceLineRequest> getLines() { return lines; }
    public void setLines(List<InvoiceLineRequest> lines) { this.lines = lines; }
}
