package com.hospital.hospitalmis.dto.clinical_result;

import java.time.LocalDateTime;

public class LabResultCreateRequest {

    private String parameterName;
    private String resultValue;
    private String unit;
    private String refLow;
    private String refHigh;
    private String abnormalFlag;
    private Long validatedBy;

    // getters/setters

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
}
