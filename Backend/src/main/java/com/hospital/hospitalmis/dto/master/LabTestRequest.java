package com.hospital.hospitalmis.dto.master;

import lombok.Data;

@Data
public class LabTestRequest {
    private String code;
    private String name;
    private Long serviceItemId; // ID của ServiceItem đã tạo trước đó
    private String specimenType; // Máu, Nước tiểu...
}