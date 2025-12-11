package com.hospital.hospitalmis.dto.master;

import lombok.Data;

@Data
public class ImagingProcedureDto {
    private Long id;
    private String code;
    private String name;
    private String modality;

    private Long serviceItemId;
    private String serviceItemName;
}
