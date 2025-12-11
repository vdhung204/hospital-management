package com.hospital.hospitalmis.dto.master;

import lombok.Data;

@Data
public class ImagingProcedureRequest {
    private String code;
    private String name;
    private Long serviceItemId;
    private String modality; // X-Ray, CT, MRI...
}
