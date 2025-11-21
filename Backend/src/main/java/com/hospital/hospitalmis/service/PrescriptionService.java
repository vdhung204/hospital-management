package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.prescription.PrescriptionCreateRequest;
import com.hospital.hospitalmis.dto.prescription.PrescriptionDetailDto;

import java.util.List;

public interface PrescriptionService {

    PrescriptionDetailDto createPrescription(Long encounterId, PrescriptionCreateRequest request);

    PrescriptionDetailDto getById(Long id);

    List<PrescriptionDetailDto> getByEncounter(Long encounterId);

    PrescriptionDetailDto cancelPrescription(Long id);
}
