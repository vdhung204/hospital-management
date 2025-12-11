package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.auth.StaffRegisterRequest;
import com.hospital.hospitalmis.dto.master.DoctorDto;
import com.hospital.hospitalmis.dto.master.StaffResponse;
import com.hospital.hospitalmis.entity.Role;
import com.hospital.hospitalmis.repository.RoleRepository;
import com.hospital.hospitalmis.service.StaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staffs")
public class StaffController {

    private final StaffService staffService;


    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ResponseEntity<List<StaffResponse>> getAll() {
        return ResponseEntity.ok(staffService.getAllStaffs());
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorDto>> getDoctors(
            @RequestParam(required = false) Long departmentId
    ) {
        return ResponseEntity.ok(staffService.getDoctors(departmentId));
    }
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getRoles() {
        return ResponseEntity.ok(staffService.getRoles());
    }
    @PutMapping("/{id}")
    public ResponseEntity<StaffResponse> update(@PathVariable Long id, @RequestBody StaffRegisterRequest req) {
        return ResponseEntity.ok(staffService.updateStaff(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Void> toggleStatus(@PathVariable Long id) {
        staffService.toggleStaffStatus(id);
        return ResponseEntity.noContent().build();
    }
}