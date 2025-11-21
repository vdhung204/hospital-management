package com.hospital.hospitalmis.service.impl;

import com.hospital.hospitalmis.dto.master.ServiceItemDto;
import com.hospital.hospitalmis.dto.master.ServiceItemRequest;
import com.hospital.hospitalmis.dto.master.TariffDto;
import com.hospital.hospitalmis.dto.master.TariffRequest;
import com.hospital.hospitalmis.entity.Department;
import com.hospital.hospitalmis.entity.ServiceItem;
import com.hospital.hospitalmis.entity.Tariff;
import com.hospital.hospitalmis.repository.DepartmentRepository;
import com.hospital.hospitalmis.repository.ServiceItemRepository;
import com.hospital.hospitalmis.repository.TariffRepository;
import com.hospital.hospitalmis.service.ServiceItemService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ServiceItemServiceImpl implements ServiceItemService {

    private final ServiceItemRepository serviceItemRepository;
    private final TariffRepository tariffRepository;
    private final DepartmentRepository departmentRepository;

    public ServiceItemServiceImpl(ServiceItemRepository serviceItemRepository,
                                  TariffRepository tariffRepository,
                                  DepartmentRepository departmentRepository) {
        this.serviceItemRepository = serviceItemRepository;
        this.tariffRepository = tariffRepository;
        this.departmentRepository = departmentRepository;
    }

    private TariffDto toTariffDto(Tariff t) {
        TariffDto dto = new TariffDto();
        dto.setId(t.getId());
        dto.setPayerType(t.getPayerType());
        dto.setPrice(t.getPrice());
        dto.setEffectiveFrom(t.getEffectiveFrom());
        dto.setEffectiveTo(t.getEffectiveTo());
        return dto;
    }

    private ServiceItemDto toDto(ServiceItem s, boolean includeTariffs) {
        ServiceItemDto dto = new ServiceItemDto();
        dto.setId(s.getId());
        dto.setCode(s.getCode());
        dto.setName(s.getName());
        dto.setServiceType(s.getServiceType());

        Department dep = s.getDepartment();
        if (dep != null) {
            dto.setDepartmentId(dep.getId());
            dto.setDepartmentCode(dep.getCode());
            dto.setDepartmentName(dep.getName());
        }

        if (includeTariffs) {
            List<TariffDto> tariffDtos = tariffRepository.findByServiceItem_Id(s.getId())
                    .stream()
                    .map(this::toTariffDto)
                    .toList();
            dto.setTariffs(tariffDtos);
        }

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceItemDto> getAll() {
        return serviceItemRepository.findAll()
                .stream()
                .map(s -> toDto(s, false))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceItemDto getById(Long id) {
        ServiceItem s = serviceItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service item not found"));
        return toDto(s, true);
    }

    @Override
    public ServiceItemDto create(ServiceItemRequest request) {
        if (serviceItemRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Service item code already exists");
        }

        ServiceItem s = new ServiceItem();
        s.setCode(request.getCode());
        s.setName(request.getName());
        s.setServiceType(request.getServiceType());

        if (request.getDepartmentId() != null) {
            Department dep = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            s.setDepartment(dep);
        }

        ServiceItem saved = serviceItemRepository.save(s);
        return toDto(saved, false);
    }

    @Override
    public ServiceItemDto update(Long id, ServiceItemRequest request) {
        ServiceItem s = serviceItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service item not found"));

        if (!s.getCode().equals(request.getCode())
                && serviceItemRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Service item code already exists");
        }

        s.setCode(request.getCode());
        s.setName(request.getName());
        s.setServiceType(request.getServiceType());

        if (request.getDepartmentId() != null) {
            Department dep = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            s.setDepartment(dep);
        } else {
            s.setDepartment(null);
        }

        ServiceItem saved = serviceItemRepository.save(s);
        return toDto(saved, false);
    }

    @Override
    public void delete(Long id) {
        // tuỳ anh: kiểm tra đã dùng trong clinical_order / invoice_line chưa
        serviceItemRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TariffDto> getTariffs(Long serviceItemId) {
        return tariffRepository.findByServiceItem_Id(serviceItemId)
                .stream()
                .map(this::toTariffDto)
                .toList();
    }

    @Override
    public TariffDto addTariff(Long serviceItemId, TariffRequest request) {
        ServiceItem s = serviceItemRepository.findById(serviceItemId)
                .orElseThrow(() -> new RuntimeException("Service item not found"));

        Tariff t = new Tariff();
        t.setServiceItem(s);
        t.setPayerType(request.getPayerType());
        t.setPrice(request.getPrice());
        t.setEffectiveFrom(request.getEffectiveFrom());
        t.setEffectiveTo(request.getEffectiveTo());

        Tariff saved = tariffRepository.save(t);
        return toTariffDto(saved);
    }
}
