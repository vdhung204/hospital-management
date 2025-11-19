package com.hospital.hospitalmis.dto.invoice;

import java.math.BigDecimal;

public class InvoiceLineResponse {

    private Long id;
    private Long serviceItemId;
    private String serviceItemName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineAmount;
    private String sourceType;
    private Long sourceId;

    private BigDecimal insuranceAmount;
    private BigDecimal patientAmount;
    private BigDecimal appliedCoverageRate;
    private Long insuranceCardId;

    // getters/setters

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public BigDecimal getLineAmount() {
        return lineAmount;
    }

    public void setLineAmount(BigDecimal lineAmount) {
        this.lineAmount = lineAmount;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getServiceItemName() {
        return serviceItemName;
    }

    public void setServiceItemName(String serviceItemName) {
        this.serviceItemName = serviceItemName;
    }

    public Long getServiceItemId() {
        return serviceItemId;
    }

    public void setServiceItemId(Long serviceItemId) {
        this.serviceItemId = serviceItemId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getInsuranceAmount() {
        return insuranceAmount;
    }

    public void setInsuranceAmount(BigDecimal insuranceAmount) {
        this.insuranceAmount = insuranceAmount;
    }

    public BigDecimal getPatientAmount() {
        return patientAmount;
    }

    public void setPatientAmount(BigDecimal patientAmount) {
        this.patientAmount = patientAmount;
    }

    public BigDecimal getAppliedCoverageRate() {
        return appliedCoverageRate;
    }

    public void setAppliedCoverageRate(BigDecimal appliedCoverageRate) {
        this.appliedCoverageRate = appliedCoverageRate;
    }

    public Long getInsuranceCardId() {
        return insuranceCardId;
    }

    public void setInsuranceCardId(Long insuranceCardId) {
        this.insuranceCardId = insuranceCardId;
    }
}
