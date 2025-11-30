package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.*;
import com.hospital.hospitalmis.dto.encounter.EncounterDetailResponse;
import com.hospital.hospitalmis.service.EncounterDetailService;
import com.hospital.hospitalmis.service.EncounterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EncounterController {

    private final EncounterService encounterService;
    private final EncounterDetailService encounterDetailService;

    public EncounterController(EncounterService encounterService,
                               EncounterDetailService encounterDetailService) {
        this.encounterService = encounterService;
        this.encounterDetailService = encounterDetailService;
    }

    // POST /api/encounters  -> tạo lượt khám mới
    @PostMapping("/encounters")
    public ResponseEntity<EncounterResponse> createEncounter(
            @RequestBody EncounterCreateRequest request) {

        EncounterResponse created = encounterService.createEncounter(request);
        return ResponseEntity.ok(created);
    }

    // GET /api/encounters/{id} -> xem chi tiết 1 Encounter
    @GetMapping("/encounters/{id}")
    public ResponseEntity<EncounterResponse> getEncounter(@PathVariable Long id) {
        EncounterResponse dto = encounterService.getEncounter(id);
        return ResponseEntity.ok(dto);
    }

    // GET /api/patients/{patientId}/encounters -> lịch sử khám của 1 bệnh nhân
    @GetMapping("/patients/{patientId}/encounters")
    public ResponseEntity<List<EncounterResponse>> getEncountersByPatient(
            @PathVariable Long patientId) {

        List<EncounterResponse> list = encounterService.getEncountersByPatient(patientId);
        return ResponseEntity.ok(list);
    }

    // POST /api/encounters/{id}/notes  -> thêm note
    @PostMapping("/encounters/{id}/notes")
    public ResponseEntity<ClinicalNoteResponse> addNote(
            @PathVariable Long id,
            @RequestBody ClinicalNoteCreateRequest request) {

        ClinicalNoteResponse res = encounterService.addNote(id, request);
        return ResponseEntity.ok(res);
    }

    // GET /api/encounters/{id}/notes -> lấy tất cả note của encounter
    @GetMapping("/encounters/{id}/notes")
    public ResponseEntity<List<ClinicalNoteResponse>> getNotes(@PathVariable Long id) {
        List<ClinicalNoteResponse> list = encounterService.getNotesByEncounter(id);
        return ResponseEntity.ok(list);
    }

    // POST /api/encounters/{id}/diagnoses -> thêm chẩn đoán
    @PostMapping("/encounters/{id}/diagnoses")
    public ResponseEntity<DiagnosisResponse> addDiagnosis(
            @PathVariable Long id,
            @RequestBody DiagnosisRequest request) {

        DiagnosisResponse res = encounterService.addDiagnosis(id, request);
        return ResponseEntity.ok(res);
    }

    // GET /api/encounters/{id}/diagnoses -> danh sách chẩn đoán
    @GetMapping("/encounters/{id}/diagnoses")
    public ResponseEntity<List<DiagnosisResponse>> getDiagnoses(@PathVariable Long id) {
        List<DiagnosisResponse> list = encounterService.getDiagnosesByEncounter(id);
        return ResponseEntity.ok(list);
    }
    // GET /api/encounters/{id}/detail  -> gộp full thông tin encounter
    @GetMapping("/encounters/{id}/detail")
    public ResponseEntity<EncounterDetailResponse> getEncounterDetail(@PathVariable Long id) {
        EncounterDetailResponse dto = encounterDetailService.getEncounterDetail(id);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/encounters/{id}")
    public ResponseEntity<Void> deleteEncounter(@PathVariable Long id) {
        encounterService.deleteEncounter(id); // Hàm này ta vừa thêm bên Service
        return ResponseEntity.noContent().build();
    }
}
