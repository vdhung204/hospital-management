package com.hospital.hospitalmis.dto.encounter;

import lombok.Data;

@Data
public class EncounterVitalsUpdate {
    private Double height;
    private Double weight;
    private Double temperature;
    private Integer pulse;
    private String bloodPressure;
}