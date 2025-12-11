package com.hospital.hospitalmis.service.impl;

import com.hospital.hospitalmis.dto.appointment.AppointmentDetailDto;
import com.hospital.hospitalmis.dto.appointment.AppointmentListItem;
import com.hospital.hospitalmis.dto.appointment.AppointmentRequest;
import com.hospital.hospitalmis.entity.*;
import com.hospital.hospitalmis.repository.*;
import com.hospital.hospitalmis.service.AppointmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DepartmentRepository departmentRepository;
    private final StaffRepository staffRepository;
    private final EncounterRepository encounterRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  PatientRepository patientRepository,
                                  DepartmentRepository departmentRepository,
                                  StaffRepository staffRepository,
                                  EncounterRepository encounterRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.departmentRepository = departmentRepository;
        this.staffRepository = staffRepository;
        this.encounterRepository = encounterRepository;
    }

    @Override
    public AppointmentDetailDto create(AppointmentRequest req) {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Department dept = null;
        if (req.getDepartmentId() != null) {
            dept = departmentRepository.findById(req.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
        }

        Staff doctor = null;
        if (req.getDoctorId() != null) {
            doctor = staffRepository.findById(req.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
        }

        Appointment appt = new Appointment();
        appt.setPatient(patient);
        appt.setDepartment(dept);
        appt.setDoctor(doctor);
        appt.setScheduledAt(req.getScheduledAt());
        appt.setStatus("SCHEDULED"); // mặc định

        Appointment saved = appointmentRepository.save(appt);
        return toDetailDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentDetailDto getById(Long id) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        return toDetailDto(appt);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentListItem> search(
            Long patientId,
            Long departmentId,
            Long doctorId,
            LocalDate fromDate,
            LocalDate toDate,
            String status
    ) {
        // đơn giản: lấy all rồi filter bằng Java (đồ án ok)
        List<Appointment> list = appointmentRepository.findAll();

        return list.stream()
                .filter(a -> patientId == null || a.getPatient().getId().equals(patientId))
                .filter(a -> departmentId == null ||
                        (a.getDepartment() != null &&
                                a.getDepartment().getId().equals(departmentId)))
                .filter(a -> doctorId == null ||
                        (a.getDoctor() != null &&
                                a.getDoctor().getId().equals(doctorId)))
                .filter(a -> status == null || status.equalsIgnoreCase(a.getStatus()))
                .filter(a -> {
                    if (fromDate == null && toDate == null) return true;
                    LocalDate d = a.getScheduledAt().toLocalDate();
                    boolean geFrom = fromDate == null || !d.isBefore(fromDate);
                    boolean leTo   = toDate   == null || !d.isAfter(toDate);
                    return geFrom && leTo;
                })
                .map(this::toListItem)
                .toList();
    }

    // ... inject thêm EncounterRepository vào constructor ...

    @Override
    public Long checkIn(Long id) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!"SCHEDULED".equals(appt.getStatus())) {
            throw new RuntimeException("Chỉ có thể tiếp đón lịch hẹn đang chờ (SCHEDULED)");
        }

        // 1. Tạo Encounter (Ca khám) từ thông tin Lịch hẹn
        Encounter enc = new Encounter();
        enc.setPatient(appt.getPatient());
        enc.setDepartment(appt.getDepartment());
        enc.setDoctorId(appt.getDoctor().getId()); // Nếu lúc đặt lịch đã chọn bác sĩ
        enc.setVisitDate(LocalDateTime.now()); // Thời gian thực tế đến
        enc.setStatus("WAITING"); // Đưa vào hàng chờ của bác sĩ
        enc.setEncounterType("OPD"); // Mặc định Ngoại trú

        // enc.setAppointmentId(appt.getId()); // Nếu bảng Encounter có cột này (Optional)

        Encounter savedEnc = encounterRepository.save(enc);

        // 2. Cập nhật trạng thái Lịch hẹn -> COMPLETED
        appt.setStatus("COMPLETED");
        appointmentRepository.save(appt);

        return savedEnc.getId();
    }
    @Override
    public List<AppointmentDetailDto> getUpcomingByPatient(Long patientId) {
        // Lấy thời điểm hiện tại
        LocalDateTime now = LocalDateTime.now();

        // Gọi Repo lấy lịch > now
        List<Appointment> list = appointmentRepository.findByPatientIdAndScheduledAtAfterOrderByScheduledAtAsc(patientId, now);

        // Convert sang DTO (Lọc bỏ các lịch đã Cancel nếu muốn)
        return list.stream()
                .filter(a -> !"CANCELLED".equals(a.getStatus())) // Tùy chọn: Ẩn lịch đã hủy
                .map(this::toDetailDto) // Sử dụng hàm toDetailDto đã có sẵn trong class này
                .toList();
    }

    @Override
    public AppointmentDetailDto cancel(Long id) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appt.setStatus("CANCELLED");
        Appointment saved = appointmentRepository.save(appt);
        return toDetailDto(saved);
    }

    @Override
    public AppointmentDetailDto markDone(Long id) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appt.setStatus("DONE");
        Appointment saved = appointmentRepository.save(appt);
        return toDetailDto(saved);
    }

    @Override
    public AppointmentDetailDto createForPatientByDoctor(Long patientId, Long doctorId, LocalDateTime scheduledAt) {
        // 1. Load patient
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // 2. Load doctor (Staff)
        Staff doctor = staffRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 3. Kiểm tra đúng là DOCTOR
        if (!"DOCTOR".equalsIgnoreCase(doctor.getStaffType())) {
            throw new RuntimeException("Selected staff is not a doctor");
        }

        // 4. Lấy department từ doctor
        Department dept = doctor.getDepartment();
        if (dept == null) {
            throw new RuntimeException("Doctor has no department");
        }

        // 5. Chỉ cho phép nếu dept là khoa khám bệnh (VD code = KKB)
        if (!"OPD".equalsIgnoreCase(dept.getCode())) {
            throw new RuntimeException("Doctor is not in outpatient clinic department");
        }

        // 6. Tạo appointment
        Appointment appt = new Appointment();
        appt.setPatient(patient);
        appt.setDepartment(dept);
        appt.setDoctor(doctor);
        appt.setScheduledAt(scheduledAt);
        appt.setStatus("SCHEDULED");

        Appointment saved = appointmentRepository.save(appt);
        return toDetailDto(saved);
    }


    // ===== mapping helpers =====

    private AppointmentDetailDto toDetailDto(Appointment a) {
        AppointmentDetailDto dto = new AppointmentDetailDto();
        dto.setId(a.getId());

        dto.setPatientId(a.getPatient().getId());
        dto.setPatientCode(a.getPatient().getPatientCode());
        dto.setPatientName(a.getPatient().getFullName());

        if (a.getDepartment() != null) {
            dto.setDepartmentId(a.getDepartment().getId());
            dto.setDepartmentCode(a.getDepartment().getCode());
            dto.setDepartmentName(a.getDepartment().getName());
        }

        if (a.getDoctor() != null) {
            dto.setDoctorId(a.getDoctor().getId());
            dto.setDoctorName(a.getDoctor().getFullName());
        }

        dto.setScheduledAt(a.getScheduledAt());
        dto.setStatus(a.getStatus());

        return dto;
    }

    private AppointmentListItem toListItem(Appointment a) {
        AppointmentListItem dto = new AppointmentListItem();
        dto.setId(a.getId());

        dto.setPatientId(a.getPatient().getId());
        dto.setPatientCode(a.getPatient().getPatientCode());
        dto.setPatientName(a.getPatient().getFullName());

        if (a.getDepartment() != null) {
            dto.setDepartmentId(a.getDepartment().getId());
            dto.setDepartmentName(a.getDepartment().getName());
        }

        if (a.getDoctor() != null) {
            dto.setDoctorId(a.getDoctor().getId());
            dto.setDoctorName(a.getDoctor().getFullName());
        }

        dto.setScheduledAt(a.getScheduledAt());
        dto.setStatus(a.getStatus());

        return dto;
    }
}
