package com.hospital.hospitalmis.service.impl;

import com.hospital.hospitalmis.dto.master.DepartmentDto;
import com.hospital.hospitalmis.dto.master.DepartmentRequest;
import com.hospital.hospitalmis.entity.Department;
import com.hospital.hospitalmis.repository.DepartmentRepository;
import com.hospital.hospitalmis.service.DepartmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    private DepartmentDto toDto(Department entity) {
        DepartmentDto dto = new DepartmentDto();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setName(entity.getName());
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDto> getAll() {
        return departmentRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDto getById(Long id) {
        Department dep = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        return toDto(dep);
    }

    @Override
    public DepartmentDto create(DepartmentRequest request) {
        if (departmentRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Department code already exists");
        }

        Department dep = new Department();
        dep.setCode(request.getCode());
        dep.setName(request.getName());

        Department saved = departmentRepository.save(dep);
        return toDto(saved);
    }

    @Override
    public DepartmentDto update(Long id, DepartmentRequest request) {
        Department dep = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        // nếu đổi code, kiểm tra trùng
        if (!dep.getCode().equals(request.getCode())
                && departmentRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Department code already exists");
        }

        dep.setCode(request.getCode());
        dep.setName(request.getName());

        Department saved = departmentRepository.save(dep);
        return toDto(saved);
    }

    @Override
    public void delete(Long id) {
        // tuỳ anh, có thể check ràng buộc (có encounter, staff, service_item đang dùng không)
        departmentRepository.deleteById(id);
    }
}
