package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.pharmacy.DispenseCreateRequest;
import com.hospital.hospitalmis.dto.pharmacy.DispenseDetailDto;
import com.hospital.hospitalmis.service.DispenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispenses")
public class DispenseController {

    private final DispenseService dispenseService;

    public DispenseController(DispenseService dispenseService) {
        this.dispenseService = dispenseService;
    }

    // POST /api/dispenses  : tạo phiếu phát thuốc
    @PostMapping
    public ResponseEntity<DispenseDetailDto> create(@RequestBody DispenseCreateRequest request) {
        DispenseDetailDto dto = dispenseService.createDispense(request);
        return ResponseEntity.ok(dto);
    }

    // GET /api/dispenses/{id} : xem chi tiết 1 phiếu
    @GetMapping("/{id}")
    public ResponseEntity<DispenseDetailDto> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(dispenseService.getById(id));
    }

    // GET /api/dispenses/by-prescription/{prescriptionId}
    @GetMapping("/by-prescription/{prescriptionId}")
    public ResponseEntity<List<DispenseDetailDto>> getByPrescription(
            @PathVariable Long prescriptionId
    ) {
        return ResponseEntity.ok(dispenseService.getByPrescription(prescriptionId));
    }
}
