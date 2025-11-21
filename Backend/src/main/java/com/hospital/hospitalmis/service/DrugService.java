package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.master.DrugDto;
import com.hospital.hospitalmis.dto.master.DrugRequest;

import java.util.List;

public interface DrugService {

    List<DrugDto> getAll();

    DrugDto getById(Long id);

    DrugDto create(DrugRequest request);

    DrugDto update(Long id, DrugRequest request);

    void delete(Long id);
}
