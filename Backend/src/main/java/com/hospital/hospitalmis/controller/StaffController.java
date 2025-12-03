package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.master.DoctorDto;
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

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorDto>> getDoctors(
            @RequestParam(required = false) Long departmentId
    ) {
        return ResponseEntity.ok(staffService.getDoctors(departmentId));
    }
}