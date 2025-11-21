package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.master.DrugBatchDto;
import com.hospital.hospitalmis.dto.master.DrugBatchRequest;
import com.hospital.hospitalmis.dto.prescribe.DrugBatchAllocationResultDto;

import java.util.List;

public interface DrugBatchService {

    List<DrugBatchDto> getAll();

    DrugBatchDto getById(Long id);

    List<DrugBatchDto> getByDrug(Long drugId);

    DrugBatchDto create(DrugBatchRequest request);

    DrugBatchDto update(Long id, DrugBatchRequest request);

    void delete(Long id);

    DrugBatchAllocationResultDto allocateBatches(Long drugId, Integer quantity);
}
