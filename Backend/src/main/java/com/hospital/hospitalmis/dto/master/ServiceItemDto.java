package com.hospital.hospitalmis.dto.master;

import java.util.List;

public class ServiceItemDto {

    private Long id;
    private String code;
    private String name;
    private String serviceType;

    private Long departmentId;
    private String departmentCode;
    private String departmentName;

    private List<TariffDto> tariffs; // các mức giá cấu hình

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public List<TariffDto> getTariffs() { return tariffs; }
    public void setTariffs(List<TariffDto> tariffs) { this.tariffs = tariffs; }
}
