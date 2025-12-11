package com.hospital.hospitalmis.dto.master;

import lombok.Data;

@Data
public class LabTestDto {
    private Long id;
    private String code;
    private String name;
    private String specimenType;

    // Thông tin liên kết ngược lại để kiểm tra
    private Long serviceItemId;
    private String serviceItemName;
}