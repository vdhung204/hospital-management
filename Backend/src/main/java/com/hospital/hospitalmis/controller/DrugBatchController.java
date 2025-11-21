package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.master.DrugBatchDto;
import com.hospital.hospitalmis.dto.master.DrugBatchRequest;
import com.hospital.hospitalmis.service.DrugBatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drug-batches")
@CrossOrigin(origins = "*")
public class DrugBatchController {

    private final DrugBatchService drugBatchService;

    public DrugBatchController(DrugBatchService drugBatchService) {
        this.drugBatchService = drugBatchService;
    }

    // GET /api/drug-batches
    @GetMapping
    public ResponseEntity<List<DrugBatchDto>> getAll() {
        return ResponseEntity.ok(drugBatchService.getAll());
    }

    // GET /api/drug-batches/{id}
    @GetMapping("/{id}")
    public ResponseEntity<DrugBatchDto> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(drugBatchService.getById(id));
    }

    // GET /api/drug-batches/by-drug/{drugId}
    @GetMapping("/by-drug/{drugId}")
    public ResponseEntity<List<DrugBatchDto>> getByDrug(@PathVariable Long drugId) {
        return ResponseEntity.ok(drugBatchService.getByDrug(drugId));
    }

    // POST /api/drug-batches
    @PostMapping
    public ResponseEntity<DrugBatchDto> create(@RequestBody DrugBatchRequest request) {
        DrugBatchDto dto = drugBatchService.create(request);
        return ResponseEntity.ok(dto);
    }

    // PUT /api/drug-batches/{id}
    @PutMapping("/{id}")
    public ResponseEntity<DrugBatchDto> update(
            @PathVariable Long id,
            @RequestBody DrugBatchRequest request
    ) {
        DrugBatchDto dto = drugBatchService.update(id, request);
        return ResponseEntity.ok(dto);
    }

    // DELETE /api/drug-batches/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        drugBatchService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
