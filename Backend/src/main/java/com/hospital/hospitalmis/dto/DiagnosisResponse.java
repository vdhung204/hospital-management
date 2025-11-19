package com.hospital.hospitalmis.dto;

public class DiagnosisResponse {

    private Long id;
    private Long encounterId;
    private String icd10Code;
    private String icd10Name;
    private Boolean primary;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEncounterId() { return encounterId; }
    public void setEncounterId(Long encounterId) { this.encounterId = encounterId; }

    public String getIcd10Code() { return icd10Code; }
    public void setIcd10Code(String icd10Code) { this.icd10Code = icd10Code; }

    public String getIcd10Name() { return icd10Name; }
    public void setIcd10Name(String icd10Name) { this.icd10Name = icd10Name; }

    public Boolean getPrimary() { return primary; }
    public void setPrimary(Boolean primary) { this.primary = primary; }
}
