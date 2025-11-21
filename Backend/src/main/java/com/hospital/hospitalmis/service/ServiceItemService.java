package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.master.ServiceItemDto;
import com.hospital.hospitalmis.dto.master.ServiceItemRequest;
import com.hospital.hospitalmis.dto.master.TariffDto;
import com.hospital.hospitalmis.dto.master.TariffRequest;

import java.util.List;

public interface ServiceItemService {

    List<ServiceItemDto> getAll();

    ServiceItemDto getById(Long id);

    ServiceItemDto create(ServiceItemRequest request);

    ServiceItemDto update(Long id, ServiceItemRequest request);

    void delete(Long id);

    // Tariff cho 1 service item
    List<TariffDto> getTariffs(Long serviceItemId);

    TariffDto addTariff(Long serviceItemId, TariffRequest request);
}
