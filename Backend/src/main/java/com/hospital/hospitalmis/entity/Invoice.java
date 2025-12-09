package com.hospital.hospitalmis.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoice")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK tới patient
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // FK tới encounter (có thể null)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encounter_id")
    private Encounter encounter;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "discount", nullable = false)
    private BigDecimal discount;

    @Column(name = "net_amount", nullable = false)
    private BigDecimal netAmount;

    @Column(name = "status", nullable = false, length = 20)
    private String status; // DRAFT, PAID, PARTIAL...

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // *** NEW ***
    @Column(name = "total_insurance_amount", nullable = false)
    private BigDecimal totalInsuranceAmount = BigDecimal.ZERO;

    @Column(name = "total_patient_amount", nullable = false)
    private BigDecimal totalPatientAmount = BigDecimal.ZERO;

    @Column(name = "total_patient_copay_amount")
    private BigDecimal totalPatientCopayAmount;

    @Column(name = "total_extra_charge_amount")
    private BigDecimal totalExtraChargeAmount;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Encounter getEncounter() { return encounter; }
    public void setEncounter(Encounter encounter) { this.encounter = encounter; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BigDecimal getNetAmount() { return netAmount; }
    public void setNetAmount(BigDecimal netAmount) { this.netAmount = netAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public BigDecimal getTotalInsuranceAmount() {
        return totalInsuranceAmount;
    }

    public void setTotalInsuranceAmount(BigDecimal totalInsuranceAmount) {
        this.totalInsuranceAmount = totalInsuranceAmount;
    }

    public BigDecimal getTotalPatientAmount() {
        return totalPatientAmount;
    }

    public void setTotalPatientAmount(BigDecimal totalPatientAmount) {
        this.totalPatientAmount = totalPatientAmount;
    }

    public BigDecimal getTotalPatientCopayAmount() {
        return totalPatientCopayAmount;
    }

    public void setTotalPatientCopayAmount(BigDecimal totalPatientCopayAmount) {
        this.totalPatientCopayAmount = totalPatientCopayAmount;
    }

    public BigDecimal getTotalExtraChargeAmount() {
        return totalExtraChargeAmount;
    }

    public void setTotalExtraChargeAmount(BigDecimal totalExtraChargeAmount) {
        this.totalExtraChargeAmount = totalExtraChargeAmount;
    }
}
