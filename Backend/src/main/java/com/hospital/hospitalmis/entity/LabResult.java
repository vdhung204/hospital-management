package com.hospital.hospitalmis.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lab_result")
public class LabResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK order item
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinical_order_item_id", nullable = false)
    private ClinicalOrderItem clinicalOrderItem;

    @Column(name = "parameter_name", nullable = false, length = 100)
    private String parameterName;

    @Column(name = "result_value", nullable = false, length = 50)
    private String resultValue;

    @Column(name = "unit", length = 50)
    private String unit;

    @Column(name = "ref_low", length = 50)
    private String refLow;

    @Column(name = "ref_high", length = 50)
    private String refHigh;

    @Column(name = "abnormal_flag", length = 5)
    private String abnormalFlag; // N, H, L

    @Column(name = "validated_by")
    private Long validatedBy;  // staff id

    @Column(name = "validated_at")
    private LocalDateTime validatedAt;

    // getters/setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ClinicalOrderItem getClinicalOrderItem() {
        return clinicalOrderItem;
    }

    public void setClinicalOrderItem(ClinicalOrderItem clinicalOrderItem) {
        this.clinicalOrderItem = clinicalOrderItem;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getResultValue() {
        return resultValue;
    }

    public void setResultValue(String resultValue) {
        this.resultValue = resultValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getRefLow() {
        return refLow;
    }

    public void setRefLow(String refLow) {
        this.refLow = refLow;
    }

    public String getRefHigh() {
        return refHigh;
    }

    public void setRefHigh(String refHigh) {
        this.refHigh = refHigh;
    }

    public String getAbnormalFlag() {
        return abnormalFlag;
    }

    public void setAbnormalFlag(String abnormalFlag) {
        this.abnormalFlag = abnormalFlag;
    }

    public Long getValidatedBy() {
        return validatedBy;
    }

    public void setValidatedBy(Long validatedBy) {
        this.validatedBy = validatedBy;
    }

    public LocalDateTime getValidatedAt() {
        return validatedAt;
    }

    public void setValidatedAt(LocalDateTime validatedAt) {
        this.validatedAt = validatedAt;
    }
}
