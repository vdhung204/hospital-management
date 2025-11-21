package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.pharmacy.DispenseCreateRequest;
import com.hospital.hospitalmis.dto.pharmacy.DispenseDetailDto;

import java.util.List;

public interface DispenseService {

    DispenseDetailDto createDispense(DispenseCreateRequest request);

    DispenseDetailDto getById(Long id);

    List<DispenseDetailDto> getByPrescription(Long prescriptionId);
}
