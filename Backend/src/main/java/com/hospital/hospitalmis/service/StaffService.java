package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.master.DoctorDto;
import com.hospital.hospitalmis.entity.Staff;
import com.hospital.hospitalmis.repository.StaffRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StaffService {

    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    public List<DoctorDto> getDoctors(Long departmentId) {
        List<Staff> doctors = staffRepository.findDoctorsByDepartment(departmentId);

        return doctors.stream()
                .map(d -> new DoctorDto(
                        d.getId(),
                        d.getFullName(),
                        d.getDepartment() != null ? d.getDepartment().getId() : null,
                        d.getDepartment() != null ? d.getDepartment().getName() : ""
                ))
                .collect(Collectors.toList());
    }
}