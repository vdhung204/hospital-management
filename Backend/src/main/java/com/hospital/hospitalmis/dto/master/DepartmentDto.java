package com.hospital.hospitalmis.dto.master;

public class DepartmentDto {

    private Long id;
    private String code;
    private String name;
    private boolean isDelete;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean getIsDelete() { return isDelete; }
    public void setIsDelete(boolean isDelete) { this.isDelete = isDelete; }
}
