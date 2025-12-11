package com.hospital.hospitalmis.service.impl;

import com.hospital.hospitalmis.dto.master.ImagingProcedureDto;
import com.hospital.hospitalmis.dto.master.ImagingProcedureRequest;
import com.hospital.hospitalmis.entity.ImagingProcedure;
import com.hospital.hospitalmis.entity.ServiceItem;
import com.hospital.hospitalmis.repository.ImagingProcedureRepository;
import com.hospital.hospitalmis.repository.ServiceItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ImagingProcedureServiceImpl {

    private final ImagingProcedureRepository imagingRepository;
    private final ServiceItemRepository serviceItemRepository;

    public ImagingProcedureServiceImpl(ImagingProcedureRepository imagingRepository,
                                       ServiceItemRepository serviceItemRepository) {
        this.imagingRepository = imagingRepository;
        this.serviceItemRepository = serviceItemRepository;
    }

    // --- HÀM MAPPER ---
    private ImagingProcedureDto toDto(ImagingProcedure entity) {
        ImagingProcedureDto dto = new ImagingProcedureDto();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setName(entity.getName());
        dto.setModality(entity.getModality());

        if (entity.getServiceItemId() != null) {
            ServiceItem  serviceItem = serviceItemRepository.findById(entity.getServiceItemId()).orElse(null);
            if (serviceItem != null) {
                dto.setServiceItemId(entity.getServiceItemId());
                dto.setServiceItemName(serviceItem.getName());
            }
        }
        return dto;
    }

    @Transactional(readOnly = true)
    public List<ImagingProcedureDto> getAll() {
        return imagingRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ImagingProcedureDto create(ImagingProcedureRequest req) {
        // 1. Tìm ServiceItem
        ServiceItem si = serviceItemRepository.findById(req.getServiceItemId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ServiceItem: " + req.getServiceItemId()));

        // 2. Tạo Entity
        ImagingProcedure img = new ImagingProcedure();
        img.setCode(req.getCode());
        img.setName(req.getName());
        img.setModality(req.getModality());

        // 3. Liên kết
        img.setServiceItemId(si.getId());

        return toDto(imagingRepository.save(img));
    }

    public ImagingProcedureDto update(Long id, ImagingProcedureRequest req) {
        ImagingProcedure img = imagingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Imaging Procedure"));

        ServiceItem si = serviceItemRepository.findById(req.getServiceItemId())
                .orElseThrow(() -> new RuntimeException("ServiceItem không tồn tại"));

        img.setCode(req.getCode());
        img.setName(req.getName());
        img.setModality(req.getModality());
        img.setServiceItemId(si.getId());

        return toDto(imagingRepository.save(img));
    }

    public void delete(Long id) {
        imagingRepository.deleteById(id);
    }
}