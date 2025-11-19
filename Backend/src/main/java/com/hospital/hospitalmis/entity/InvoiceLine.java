package com.hospital.hospitalmis.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "invoice_line")
public class InvoiceLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK invoice
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_item_id", nullable = false)
    private ServiceItem serviceItem;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "line_amount", nullable = false)
    private BigDecimal lineAmount;

    @Column(name = "source_type", length = 50)
    private String sourceType; // LAB, IMG, DRUG, CONSULT...

    @Column(name = "source_id")
    private Long sourceId;

    // *** NEW ***
    @Column(name = "insurance_amount", nullable = false)
    private BigDecimal insuranceAmount = BigDecimal.ZERO;

    @Column(name = "patient_amount", nullable = false)
    private BigDecimal patientAmount = BigDecimal.ZERO;

    @Column(name = "applied_coverage_rate")
    private BigDecimal appliedCoverageRate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insurance_card_id")
    private InsuranceCard insuranceCard;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }

    public ServiceItem getServiceItem() { return serviceItem; }
    public void setServiceItem(ServiceItem serviceItem) { this.serviceItem = serviceItem; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getLineAmount() { return lineAmount; }
    public void setLineAmount(BigDecimal lineAmount) { this.lineAmount = lineAmount; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

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

    public InsuranceCard getInsuranceCard() {
        return insuranceCard;
    }

    public void setInsuranceCard(InsuranceCard insuranceCard) {
        this.insuranceCard = insuranceCard;
    }
}
