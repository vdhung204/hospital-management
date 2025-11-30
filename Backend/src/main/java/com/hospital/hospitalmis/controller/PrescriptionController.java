package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.prescription.PrescriptionCreateRequest;
import com.hospital.hospitalmis.dto.prescription.PrescriptionDetailDto;
import com.hospital.hospitalmis.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    // POST /api/encounters/{encounterId}/prescriptions : tạo đơn mới
    @PostMapping("/encounters/{encounterId}/prescriptions")
    public ResponseEntity<PrescriptionDetailDto> create(
            @PathVariable Long encounterId,
            @RequestBody PrescriptionCreateRequest request
    ) {
        PrescriptionDetailDto dto =
                prescriptionService.createPrescription(encounterId, request);
        return ResponseEntity.ok(dto);
    }

    // GET /api/encounters/{encounterId}/prescriptions : danh sách đơn theo encounter
    @GetMapping("/encounters/{encounterId}/prescriptions")
    public ResponseEntity<List<PrescriptionDetailDto>> getByEncounter(
            @PathVariable Long encounterId
    ) {
        return ResponseEntity.ok(prescriptionService.getByEncounter(encounterId));
    }

    // GET /api/prescriptions/{id} : chi tiết 1 đơn
    @GetMapping("/prescriptions/{id}")
    public ResponseEntity<PrescriptionDetailDto> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.getById(id));
    }

    // POST /api/prescriptions/{id}/cancel : huỷ đơn
    @PostMapping("/prescriptions/{id}/cancel")
    public ResponseEntity<PrescriptionDetailDto> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.cancelPrescription(id));
    }
}
