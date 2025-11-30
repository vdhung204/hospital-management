package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.appointment.AppointmentByDoctorRequest;
import com.hospital.hospitalmis.dto.appointment.AppointmentDetailDto;
import com.hospital.hospitalmis.dto.appointment.AppointmentListItem;
import com.hospital.hospitalmis.dto.appointment.AppointmentRequest;
import com.hospital.hospitalmis.dto.auth.CurrentUserResponse;
import com.hospital.hospitalmis.entity.UserAccount;
import com.hospital.hospitalmis.repository.UserAccountRepository;
import com.hospital.hospitalmis.service.AppointmentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserAccountRepository userAccountRepository;

    public AppointmentController(AppointmentService appointmentService,
                                 UserAccountRepository userAccountRepository) {
        this.appointmentService = appointmentService;
        this.userAccountRepository = userAccountRepository;
    }

    @PostMapping
    public ResponseEntity<AppointmentDetailDto> create(@RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDetailDto> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<AppointmentListItem>> search(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) String status
    ) {
        List<AppointmentListItem> result = appointmentService.search(
                patientId, departmentId, doctorId, fromDate, toDate, status
        );
        return ResponseEntity.ok(result);
    }

    @PostMapping("/self/by-doctor")
    public ResponseEntity<AppointmentDetailDto> createForSelfByDoctor(
            @RequestBody AppointmentByDoctorRequest request
    ) {
        Long patientId = getCurrentPatientId();
        AppointmentDetailDto dto = appointmentService.createForPatientByDoctor(
                patientId,
                request.getDoctorId(),
                request.getScheduledAt()
        );
        return ResponseEntity.ok(dto);
    }

    private Long getCurrentPatientId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        var principal = auth.getPrincipal();

        if (!(principal instanceof CurrentUserResponse uad)) {
            throw new RuntimeException("Unauthenticated");
        }

        Long userId = uad.getUserId();
        UserAccount ua = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("UserAccount not found"));

        if (ua.getPatientId() == null) {
            throw new RuntimeException("Current user is not a patient");
        }

        return ua.getPatientId();
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<AppointmentDetailDto> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancel(id));
    }

    @PostMapping("/{id}/done")
    public ResponseEntity<AppointmentDetailDto> markDone(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.markDone(id));
    }
}
