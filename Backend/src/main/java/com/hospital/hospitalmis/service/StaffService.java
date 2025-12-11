package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.auth.StaffRegisterRequest;
import com.hospital.hospitalmis.dto.master.DoctorDto;
import com.hospital.hospitalmis.dto.master.StaffResponse;
import com.hospital.hospitalmis.entity.Department;
import com.hospital.hospitalmis.entity.Role;
import com.hospital.hospitalmis.entity.Staff;
import com.hospital.hospitalmis.entity.UserAccount;
import com.hospital.hospitalmis.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StaffService {

    private final StaffRepository staffRepository;
    private final RoleRepository roleRepository;
    private final UserAccountRepository userAccountRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffService(StaffRepository staffRepository,
                        RoleRepository roleRepository,
                        PasswordEncoder passwordEncoder,
                        UserAccountRepository userAccountRepository,
                        DepartmentRepository departmentRepository) {
        this.staffRepository = staffRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userAccountRepository = userAccountRepository;
        this.departmentRepository = departmentRepository;
    }
    // ... imports

    // 1. Cập nhật nhân viên
    public StaffResponse updateStaff(Long id, StaffRegisterRequest req) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        UserAccount user = staff.getUser();

        // --- Cập nhật thông tin User Account ---
        // Chỉ đổi pass nếu req có gửi lên (khác null/empty)
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        }

        // Cập nhật Role (nếu thay đổi staffType)
        if (!staff.getStaffType().equals(req.getStaffType())) {
            // Xóa role cũ
            user.getRoles().clear();
            // Thêm role mới
            Role newRole = roleRepository.findByCode(req.getStaffType())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + req.getStaffType()));
            user.getRoles().add(newRole);
        }
        userAccountRepository.save(user);

        // --- Cập nhật thông tin Staff ---
        staff.setFullName(req.getFullName());
        staff.setGender(req.getGender());
        staff.setDateOfBirth(req.getDateOfBirth());
        staff.setPhone(req.getPhone());
        staff.setEmail(req.getEmail());
        staff.setIdNumber(req.getIdNumber());
        staff.setAddress(req.getAddress());
        staff.setStaffType(req.getStaffType());
        staff.setPosition(req.getPosition());
        staff.setHireDate(req.getHireDate());

        if (req.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(req.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            staff.setDepartment(dept);
        } else {
            staff.setDepartment(null);
        }

        Staff updatedStaff = staffRepository.save(staff);
        return mapToResponse(updatedStaff);
    }

    // 2. Xóa mềm (Deactivate)
    public void deleteStaff(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        staff.setIsActive(false);
        if (staff.getUser() != null) {
            staff.getUser().setIsActive(false);
            userAccountRepository.save(staff.getUser());
        }

        staffRepository.save(staff);
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

    public List<Role> getRoles() {
        List<Role> roles = roleRepository.findAll();
        return roles;
    }

    public List<StaffResponse> getAllStaffs() {
        List<Staff> staffList = staffRepository.findAll();

        // Convert List<Staff> -> List<StaffResponse>
        return staffList.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void toggleStaffStatus(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        // Đảo ngược trạng thái hiện tại
        boolean newStatus = !staff.getIsActive();
        staff.setIsActive(newStatus);

        // Cập nhật luôn tài khoản User liên quan
        if (staff.getUser() != null) {
            staff.getUser().setIsActive(newStatus);
            userAccountRepository.save(staff.getUser());
        }

        staffRepository.save(staff);
    }
    // Hàm helper để map dữ liệu
    private StaffResponse mapToResponse(Staff staff) {
        StaffResponse dto = new StaffResponse();
        dto.setId(staff.getId());
        dto.setStaffCode(staff.getStaffCode());
        dto.setFullName(staff.getFullName());
        dto.setGender(staff.getGender());
        dto.setDateOfBirth(staff.getDateOfBirth());
        dto.setPhone(staff.getPhone());
        dto.setEmail(staff.getEmail());
        dto.setAddress(staff.getAddress());
        dto.setStaffType(staff.getStaffType());
        dto.setPosition(staff.getPosition());
        dto.setHireDate(staff.getHireDate());
        dto.setActive(staff.getIsActive());

        // Xử lý Department (tránh NullPointerException)
        if (staff.getDepartment() != null) {
            dto.setDepartmentId(staff.getDepartment().getId());
            dto.setDepartmentName(staff.getDepartment().getName());
        }

        // Xử lý UserAccount (tránh NullPointerException)
        if (staff.getUser() != null) {
            dto.setUsername(staff.getUser().getUsername());
        }

        return dto;
    }
}