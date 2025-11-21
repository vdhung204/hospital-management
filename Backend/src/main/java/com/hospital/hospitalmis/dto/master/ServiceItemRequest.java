package com.hospital.hospitalmis.dto.master;

public class ServiceItemRequest {

    private String code;
    private String name;
    private String serviceType;   // CONSULT, LAB, IMG, DRUG, OTHER
    private Long departmentId;    // có thể null

    // getters/setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
}
