package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.*;
import com.hospital.hospitalmis.entity.*;
import com.hospital.hospitalmis.repository.*;
import com.hospital.hospitalmis.repository.EncounterRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EncounterService {

    private final EncounterRepository encounterRepository;
    private final PatientRepository patientRepository;
    private final DepartmentRepository departmentRepository;
    private final EncounterDiagnosisRepository encounterDiagnosisRepository;
    private final ClinicalNoteRepository clinicalNoteRepository;
    private final ICD10CodeRepository icd10CodeRepository;

    public EncounterService(EncounterRepository encounterRepository,
                            PatientRepository patientRepository,
                            DepartmentRepository departmentRepository,
                            EncounterDiagnosisRepository encounterDiagnosisRepository,
                            ClinicalNoteRepository clinicalNoteRepository,
                            ICD10CodeRepository icd10CodeRepository) {
        this.encounterRepository = encounterRepository;
        this.patientRepository = patientRepository;
        this.departmentRepository = departmentRepository;
        this.encounterDiagnosisRepository = encounterDiagnosisRepository;
        this.clinicalNoteRepository = clinicalNoteRepository;
        this.icd10CodeRepository = icd10CodeRepository;
    }

    // Tạo lượt khám mới
    public EncounterResponse createEncounter(EncounterCreateRequest req) {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Department department = null;
        if (req.getDepartmentId() != null) {
            department = departmentRepository.findById(req.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
        }

        Encounter enc = new Encounter();
        enc.setPatient(patient);
        enc.setDepartment(department);
        enc.setDoctorId(req.getDoctorId());
        enc.setEncounterType(req.getEncounterType());
        enc.setVisitDate(req.getVisitDate());
        enc.setStatus(req.getStatus());

        Encounter saved = encounterRepository.save(enc);
        return mapToResponse(saved);
    }

    // Lấy chi tiết 1 Encounter
    public EncounterResponse getEncounter(Long id) {
        Encounter enc = encounterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Encounter not found"));
        return mapToResponse(enc);
    }

    // Lịch sử khám theo bệnh nhân
    public List<EncounterResponse> getEncountersByPatient(Long patientId) {
        List<Encounter> list = encounterRepository.findByPatient_Id(patientId);
        return list.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Map Entity -> DTO
    private EncounterResponse mapToResponse(Encounter enc) {
        EncounterResponse dto = new EncounterResponse();
        dto.setId(enc.getId());

        if (enc.getPatient() != null) {
            dto.setPatientId(enc.getPatient().getId());
            dto.setPatientCode(enc.getPatient().getPatientCode());
            dto.setPatientName(enc.getPatient().getFullName());
        }

        if (enc.getDepartment() != null) {
            dto.setDepartmentId(enc.getDepartment().getId());
            dto.setDepartmentName(enc.getDepartment().getName());
        }

        dto.setDoctorId(enc.getDoctorId());
        dto.setEncounterType(enc.getEncounterType());
        dto.setVisitDate(enc.getVisitDate());
        dto.setStatus(enc.getStatus());

        return dto;
    }

    //create clinical note
    public ClinicalNoteResponse addNote(Long encounterId, ClinicalNoteCreateRequest req) {
        Encounter enc = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new RuntimeException("Encounter not found"));

        ClinicalNote note = new ClinicalNote();
        note.setEncounter(enc);
        note.setNoteType(req.getNoteType());
        note.setContent(req.getContent());
        note.setCreatedBy(req.getCreatedBy());
        note.setCreatedAt(LocalDateTime.now());

        ClinicalNote saved = clinicalNoteRepository.save(note);
        return mapNoteToResponse(saved);
    }

    public List<ClinicalNoteResponse> getNotesByEncounter(Long encounterId) {
        return clinicalNoteRepository.findByEncounter_IdOrderByCreatedAtAsc(encounterId)
                .stream()
                .map(this::mapNoteToResponse)
                .collect(Collectors.toList());
    }

    private ClinicalNoteResponse mapNoteToResponse(ClinicalNote note) {
        ClinicalNoteResponse dto = new ClinicalNoteResponse();
        dto.setId(note.getId());
        dto.setEncounterId(note.getEncounter().getId());
        dto.setNoteType(note.getNoteType());
        dto.setContent(note.getContent());
        dto.setCreatedBy(note.getCreatedBy());
        dto.setCreatedAt(note.getCreatedAt());
        return dto;
    }
    // create dignosis
    public DiagnosisResponse addDiagnosis(Long encounterId, DiagnosisRequest req) {
        Encounter enc = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new RuntimeException("Encounter not found"));

        ICD10Code icd = icd10CodeRepository.findById(req.getIcd10Code())
                .orElseThrow(() -> new RuntimeException("ICD10 code not found"));

        EncounterDiagnosis diag = new EncounterDiagnosis();
        diag.setEncounter(enc);
        diag.setIcd10Code(icd);
        diag.setIsPrimary(req.getPrimary() != null ? req.getPrimary() : false);

        EncounterDiagnosis saved = encounterDiagnosisRepository.save(diag);
        return mapDiagToResponse(saved);
    }

    public List<DiagnosisResponse> getDiagnosesByEncounter(Long encounterId) {
        return encounterDiagnosisRepository.findByEncounter_Id(encounterId).stream()
                .map(this::mapDiagToResponse)
                .collect(Collectors.toList());
    }

    private DiagnosisResponse mapDiagToResponse(EncounterDiagnosis d) {
        DiagnosisResponse dto = new DiagnosisResponse();
        dto.setId(d.getId());
        dto.setEncounterId(d.getEncounter().getId());
        if (d.getIcd10Code() != null) {
            dto.setIcd10Code(d.getIcd10Code().getCode());
            dto.setIcd10Name(d.getIcd10Code().getName());
        }
        dto.setPrimary(d.getIsPrimary());
        return dto;
    }

}
