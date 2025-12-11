package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.*;
import com.hospital.hospitalmis.dto.encounter.EncounterVitalsUpdate;
import com.hospital.hospitalmis.entity.*;
import com.hospital.hospitalmis.repository.*;
import com.hospital.hospitalmis.repository.EncounterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.Console;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EncounterService {

    private final EncounterRepository encounterRepository;
    private final PatientRepository patientRepository;
    private final DepartmentRepository departmentRepository;
    private final EncounterDiagnosisRepository encounterDiagnosisRepository;
    private final ClinicalNoteRepository clinicalNoteRepository;
    private final ICD10CodeRepository icd10CodeRepository;
    private final AppointmentRepository appointmentRepository;

    public EncounterService(EncounterRepository encounterRepository,
                            PatientRepository patientRepository,
                            DepartmentRepository departmentRepository,
                            EncounterDiagnosisRepository encounterDiagnosisRepository,
                            ClinicalNoteRepository clinicalNoteRepository,
                            ICD10CodeRepository icd10CodeRepository,
                            AppointmentRepository appointmentRepository) {
        this.encounterRepository = encounterRepository;
        this.patientRepository = patientRepository;
        this.departmentRepository = departmentRepository;
        this.encounterDiagnosisRepository = encounterDiagnosisRepository;
        this.clinicalNoteRepository = clinicalNoteRepository;
        this.icd10CodeRepository = icd10CodeRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public EncounterResponse createEncounter(EncounterCreateRequest req) {
        // 1. Validate Patient and department
        Patient patient = patientRepository.findByIdAndIsDeletedFalse(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found or deleted"));
        Department department = departmentRepository.findByIdAndIsDeletedFalse(req.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found or deleted"));
        // 2. Xử lý hàng đợi (Queue Number)
        // Logic: Lấy số lớn nhất trong ngày của khoa đó + 1
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        Integer maxQ = encounterRepository.findMaxQueueNumber(req.getDepartmentId(), startOfDay, endOfDay);
        int nextQueue = (maxQ == null) ? 1 : maxQ + 1;

        // 3. Xử lý liên kết Appointment (nếu có)
        Appointment appt = null;
        if (req.getAppointmentId() != null) {
            appt = appointmentRepository.findById(req.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            if(!appt.getPatient().getId().equals(patient.getId())) {
                throw new RuntimeException("Incorrect patient id");
            }
            // Cập nhật trạng thái lịch hẹn thành DONE (đã đến khám)
            appt.setStatus("DONE");
            appointmentRepository.save(appt);
        }
        // Tạo Entity
        Encounter enc = new Encounter();
        enc.setPatient(patient);
        enc.setDepartment(department); // lấy từ repo
        enc.setDoctorId(req.getDoctorId());
        enc.setEncounterType(req.getEncounterType());
        enc.setVisitDate(LocalDateTime.now());
        enc.setStatus("WAITING"); // Mặc định là Chờ khám

        // Gán các trường mới
        enc.setIsDeleted(false);
        enc.setQueueNumber(nextQueue);
        enc.setAppointment(appt);
//        enc.setHeight(req.getHeight());
//        enc.setWeight(req.getWeight());
//        enc.setTemperature(req.getTemperature());
//        enc.setBloodPressure(req.getBloodPressure());
//        enc.setPulse(req.getPulse());

        Encounter saved = encounterRepository.save(enc);
        return mapToResponse(saved);
    }
    public void updateStatus(Long id, String newStatus) {
        Encounter enc = encounterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Encounter not found"));
        enc.setStatus(newStatus);
        encounterRepository.save(enc);
    }
    // Hàm Soft Delete
    public void deleteEncounter(Long id) {
        Encounter enc = encounterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        enc.setIsDeleted(true); // Đánh dấu xóa
        encounterRepository.save(enc);
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
            dto.setEncounterType(enc.getPatient().getGender());
            dto.setParientGender(enc.getPatient().getGender());
            dto.setPatientDob(enc.getPatient().getDateOfBirth());
        }

        if (enc.getDepartment() != null) {
            dto.setDepartmentId(enc.getDepartment().getId());
            dto.setDepartmentName(enc.getDepartment().getName());
        }

        dto.setDoctorId(enc.getDoctorId());
        dto.setEncounterType(enc.getEncounterType());
        dto.setVisitDate(enc.getVisitDate());
        dto.setStatus(enc.getStatus());
        dto.setQueueNumber(enc.getQueueNumber());
        if(enc.getHeight() != null) {
            dto.setHeight(enc.getHeight());
        }
        if(enc.getWeight() != null) {
            dto.setWeight(enc.getWeight());
        }
        if(enc.getBloodPressure() != null) {
            dto.setBloodPressure(enc.getBloodPressure());
        }
        if(enc.getPulse() != null) {
            dto.setPulse(enc.getPulse());
        }
        if(enc.getTemperature() != null) {
            dto.setTemperature(enc.getTemperature());
        }
        return dto;
    }

    public List<EncounterResponse> getHistoryByPatient(Long patientId) {
        // Gọi Repo
        List<Encounter> list = encounterRepository.findByPatientIdOrderByVisitDateDesc(patientId);

        // Convert sang DTO
        return list.stream()
                .map(this::mapToResponse) // Sử dụng hàm toDetailDto đã có sẵn
                .toList();
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
        System.out.println("hehe");
        EncounterDiagnosis diag = new EncounterDiagnosis();
        diag.setEncounter(enc);
        diag.setIcd10Code(icd);
        diag.setIsPrimary(req.getPrimary() != null ? req.getPrimary() : false);

        EncounterDiagnosis saved = encounterDiagnosisRepository.save(diag);
        return mapDiagToResponse(saved);
    }

    public EncounterResponse updateVitals(Long id, EncounterVitalsUpdate req) {
        Encounter enc = encounterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Encounter not found"));

        // Chỉ update nếu giá trị gửi lên khác null (Logic PATCH chuẩn)
        if (req.getHeight() != null) enc.setHeight(req.getHeight());
        if (req.getWeight() != null) enc.setWeight(req.getWeight());
        if (req.getTemperature() != null) enc.setTemperature(req.getTemperature());
        if (req.getPulse() != null) enc.setPulse(req.getPulse());
        if (req.getBloodPressure() != null) enc.setBloodPressure(req.getBloodPressure());

        Encounter saved = encounterRepository.save(enc);
        return mapToResponse(saved);
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

    public List<EncounterResponse> getDoctorQueue(Long doctorId) {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(LocalTime.MAX);

        return encounterRepository.findDoctorQueue(doctorId, start, end)
                .stream()
                .map(this::mapToResponse) // Hàm map cũ bạn đã có
                .collect(Collectors.toList());
    }
}
