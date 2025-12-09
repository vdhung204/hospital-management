package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.insurance.InsuranceCardDto;
import com.hospital.hospitalmis.dto.insurance.InsuranceCardRequest;
import com.hospital.hospitalmis.service.InsuranceCardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients/{patientId}/insurance-cards")
public class InsuranceCardController {

    private final InsuranceCardService service;

    public InsuranceCardController(InsuranceCardService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<InsuranceCardDto>> getAll(@PathVariable Long patientId) {
        return ResponseEntity.ok(service.getCardsByPatient(patientId));
    }

    @PostMapping
    public ResponseEntity<InsuranceCardDto> create(@PathVariable Long patientId, @RequestBody InsuranceCardRequest req) {
        return ResponseEntity.ok(service.addCard(patientId, req));
    }

    @PutMapping("/{cardId}")
    public ResponseEntity<InsuranceCardDto> update(@PathVariable Long patientId, @PathVariable Long cardId, @RequestBody InsuranceCardRequest req) {
        return ResponseEntity.ok(service.updateCard(cardId, req));
    }

    @DeleteMapping("/{cardId}")
    public ResponseEntity<Void> delete(@PathVariable Long patientId, @PathVariable Long cardId) {
        service.deleteCard(cardId);
        return ResponseEntity.noContent().build();
    }
}
