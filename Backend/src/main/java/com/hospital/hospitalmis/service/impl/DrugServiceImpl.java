package com.hospital.hospitalmis.service.impl;

import com.hospital.hospitalmis.dto.master.DrugDto;
import com.hospital.hospitalmis.dto.master.DrugRequest;
import com.hospital.hospitalmis.entity.Drug;
import com.hospital.hospitalmis.entity.ServiceItem;
import com.hospital.hospitalmis.repository.DrugRepository;
import com.hospital.hospitalmis.repository.ServiceItemRepository;
import com.hospital.hospitalmis.service.DrugService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DrugServiceImpl implements DrugService {

    private final DrugRepository drugRepository;
    private final ServiceItemRepository serviceItemRepository;

    public DrugServiceImpl(DrugRepository drugRepository,
                           ServiceItemRepository serviceItemRepository) {
        this.drugRepository = drugRepository;
        this.serviceItemRepository = serviceItemRepository;
    }

    private DrugDto toDto(Drug d) {
        DrugDto dto = new DrugDto();
        dto.setId(d.getId());
        dto.setCode(d.getCode());
        dto.setName(d.getName());
        dto.setActiveIngredient(d.getActiveIngredient());
        dto.setForm(d.getForm());
        dto.setStrength(d.getStrength());

        ServiceItem si = d.getServiceItem();
        if (si != null) {
            dto.setServiceItemId(si.getId());
            dto.setServiceItemCode(si.getCode());
            dto.setServiceItemName(si.getName());
        }

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DrugDto> getAll() {
        return drugRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DrugDto getById(Long id) {
        Drug d = drugRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug not found"));
        return toDto(d);
    }

    @Override
    public DrugDto create(DrugRequest request) {
        if (drugRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Drug code already exists");
        }

        ServiceItem si = serviceItemRepository.findById(request.getServiceItemId())
                .orElseThrow(() -> new RuntimeException("Service item not found"));

        Drug d = new Drug();
        d.setCode(request.getCode());
        d.setName(request.getName());
        d.setActiveIngredient(request.getActiveIngredient());
        d.setForm(request.getForm());
        d.setStrength(request.getStrength());
        d.setServiceItem(si);

        Drug saved = drugRepository.save(d);
        return toDto(saved);
    }

    @Override
    public DrugDto update(Long id, DrugRequest request) {
        Drug d = drugRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug not found"));

        if (!d.getCode().equals(request.getCode())
                && drugRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Drug code already exists");
        }

        ServiceItem si = serviceItemRepository.findById(request.getServiceItemId())
                .orElseThrow(() -> new RuntimeException("Service item not found"));

        d.setCode(request.getCode());
        d.setName(request.getName());
        d.setActiveIngredient(request.getActiveIngredient());
        d.setForm(request.getForm());
        d.setStrength(request.getStrength());
        d.setServiceItem(si);

        Drug saved = drugRepository.save(d);
        return toDto(saved);
    }

    @Override
    public void delete(Long id) {
        // sau này nếu prescription_item đang dùng drug này thì cần chặn xoá
        drugRepository.deleteById(id);
    }
}
