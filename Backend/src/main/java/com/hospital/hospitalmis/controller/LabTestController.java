package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.master.LabTestDto;
import com.hospital.hospitalmis.dto.master.LabTestRequest;
import com.hospital.hospitalmis.service.impl.LabTestServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab-tests")
public class LabTestController {

    private final LabTestServiceImpl labTestService;

    public LabTestController(LabTestServiceImpl labTestService) {
        this.labTestService = labTestService;
    }

    @GetMapping
    public ResponseEntity<List<LabTestDto>> getAll() {
        return ResponseEntity.ok(labTestService.getAll());
    }

    @PostMapping
    public ResponseEntity<LabTestDto> create(@RequestBody LabTestRequest req) {
        return ResponseEntity.ok(labTestService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabTestDto> update(@PathVariable Long id, @RequestBody LabTestRequest req) {
        return ResponseEntity.ok(labTestService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        labTestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}