package com.hospital.hospitalmis.dto;

public class DiagnosisRequest {

    private String icd10Code;
    private Boolean primary;

    public String getIcd10Code() { return icd10Code; }
    public void setIcd10Code(String icd10Code) { this.icd10Code = icd10Code; }

    public Boolean getPrimary() { return primary; }
    public void setPrimary(Boolean primary) { this.primary = primary; }
}
