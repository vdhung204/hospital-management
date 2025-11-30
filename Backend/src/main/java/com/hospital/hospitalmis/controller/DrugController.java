package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.master.DrugDto;
import com.hospital.hospitalmis.dto.master.DrugRequest;
import com.hospital.hospitalmis.service.DrugService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drugs")
public class DrugController {

    private final DrugService drugService;

    public DrugController(DrugService drugService) {
        this.drugService = drugService;
    }

    // GET /api/drugs
    @GetMapping
    public ResponseEntity<List<DrugDto>> getAll() {
        return ResponseEntity.ok(drugService.getAll());
    }

    // GET /api/drugs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<DrugDto> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(drugService.getById(id));
    }

    // POST /api/drugs
    @PostMapping
    public ResponseEntity<DrugDto> create(@RequestBody DrugRequest request) {
        DrugDto dto = drugService.create(request);
        return ResponseEntity.ok(dto);
    }

    // PUT /api/drugs/{id}
    @PutMapping("/{id}")
    public ResponseEntity<DrugDto> update(
            @PathVariable Long id,
            @RequestBody DrugRequest request
    ) {
        DrugDto dto = drugService.update(id, request);
        return ResponseEntity.ok(dto);
    }

    // DELETE /api/drugs/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        drugService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
