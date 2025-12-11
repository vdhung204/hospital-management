package com.hospital.hospitalmis.service.impl;

import com.hospital.hospitalmis.dto.master.LabTestDto;
import com.hospital.hospitalmis.dto.master.LabTestRequest;
import com.hospital.hospitalmis.entity.LabTest;
import com.hospital.hospitalmis.entity.ServiceItem;
import com.hospital.hospitalmis.repository.LabTestRepository;
import com.hospital.hospitalmis.repository.ServiceItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LabTestServiceImpl  {

    private final LabTestRepository labTestRepository;
    private final ServiceItemRepository serviceItemRepository;

    public LabTestServiceImpl(LabTestRepository labTestRepository,
                              ServiceItemRepository serviceItemRepository) {
        this.labTestRepository = labTestRepository;
        this.serviceItemRepository = serviceItemRepository;
    }

    // --- HÀM MAPPER: Entity -> DTO ---
    private LabTestDto toDto(LabTest entity) {
        LabTestDto dto = new LabTestDto();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setName(entity.getName());
        dto.setSpecimenType(entity.getSpecimenType());

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
    public List<LabTestDto> getAll() {
        return labTestRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public LabTestDto create(LabTestRequest req) {
        // 1. Tìm ServiceItem gốc (Bắt buộc phải có)
        ServiceItem si = serviceItemRepository.findById(req.getServiceItemId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ServiceItem với ID: " + req.getServiceItemId()));

        // 2. Validate trùng mã (nếu cần)
        if (labTestRepository.existsByCode(req.getCode())) {
            throw new RuntimeException("Mã xét nghiệm đã tồn tại: " + req.getCode());
        }

        // 3. Tạo Entity
        LabTest lab = new LabTest();
        lab.setCode(req.getCode());
        lab.setName(req.getName());
        lab.setSpecimenType(req.getSpecimenType());

        // 4. LIÊN KẾT QUAN TRỌNG
        lab.setServiceItemId(si.getId());

        // 5. Lưu và trả về
        return toDto(labTestRepository.save(lab));
    }

    public LabTestDto update(Long id, LabTestRequest req) {
        LabTest lab = labTestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy LabTest"));

        ServiceItem si = serviceItemRepository.findById(req.getServiceItemId())
                .orElseThrow(() -> new RuntimeException("ServiceItem không tồn tại"));

        lab.setCode(req.getCode());
        lab.setName(req.getName());
        lab.setSpecimenType(req.getSpecimenType());
        lab.setServiceItemId(si.getId());

        return toDto(labTestRepository.save(lab));
    }

    public void delete(Long id) {
        labTestRepository.deleteById(id);
    }
}