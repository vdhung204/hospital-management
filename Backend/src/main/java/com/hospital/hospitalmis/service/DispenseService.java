package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.pharmacy.DispenseCreateRequest;
import com.hospital.hospitalmis.dto.pharmacy.DispenseDetailDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface DispenseService {

    DispenseDetailDto createDispense(DispenseCreateRequest request);

    DispenseDetailDto getById(Long id);

    List<DispenseDetailDto> getByPrescription(Long prescriptionId);

    List<DispenseDetailDto> getAll();
}
