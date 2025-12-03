package com.hospital.hospitalmis.dto.master;

public class DoctorDto {
    private Long id;
    private String fullName;
    private Long departmentId;
    private String departmentName;

    // Constructor
    public DoctorDto(Long id, String fullName, Long departmentId, String departmentName) {
        this.id = id;
        this.fullName = fullName;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
}