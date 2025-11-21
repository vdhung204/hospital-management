package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.master.DepartmentDto;
import com.hospital.hospitalmis.dto.master.DepartmentRequest;
import com.hospital.hospitalmis.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // GET /api/departments
    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAll() {
        System.out.println(">>> DepartmentController.getAll CALLED");
        return ResponseEntity.ok(departmentService.getAll());
    }

    // GET /api/departments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDto> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getById(id));
    }

    // POST /api/departments
    @PostMapping
    public ResponseEntity<DepartmentDto> create(@RequestBody DepartmentRequest request) {
        DepartmentDto dto = departmentService.create(request);
        return ResponseEntity.ok(dto);
    }

    // PUT /api/departments/{id}
    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDto> update(
            @PathVariable Long id,
            @RequestBody DepartmentRequest request
    ) {
        DepartmentDto dto = departmentService.update(id, request);
        return ResponseEntity.ok(dto);
    }

    // DELETE /api/departments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        departmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
