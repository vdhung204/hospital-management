package com.hospital.hospitalmis.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "icd10_code")
public class ICD10Code {

    @Id
    @Column(name = "code", length = 10)
    private String code;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    // getters/setters
    public String getCode() { return code; }

    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }
}
