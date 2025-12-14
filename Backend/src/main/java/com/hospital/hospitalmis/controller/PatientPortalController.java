package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.EncounterResponse;
import com.hospital.hospitalmis.dto.account.ChangePasswordRequest;
import com.hospital.hospitalmis.dto.account.PatientProfileUpdateRequest;
import com.hospital.hospitalmis.dto.appointment.AppointmentDetailDto;
import com.hospital.hospitalmis.dto.appointment.AppointmentRequest;
import com.hospital.hospitalmis.dto.auth.CurrentUserResponse;
import com.hospital.hospitalmis.dto.encounter.EncounterDetailResponse; // Cần tạo DTO rút gọn nếu chưa có
import com.hospital.hospitalmis.entity.UserAccount;
import com.hospital.hospitalmis.repository.UserAccountRepository;
import com.hospital.hospitalmis.service.AppointmentService;
import com.hospital.hospitalmis.service.EncounterDetailService;
import com.hospital.hospitalmis.service.EncounterService;
import com.hospital.hospitalmis.service.PatientService;
import com.hospital.hospitalmis.service.impl.PatientPortalServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/portal")
public class PatientPortalController {

    private final UserAccountRepository userAccountRepository;
    private final AppointmentService appointmentService;
    private final EncounterService encounterService;
    private final EncounterDetailService encounterDetailService;
    private final PatientPortalServiceImpl portalService;

    public PatientPortalController(UserAccountRepository userAccountRepository,
                                   AppointmentService appointmentService,
                                   EncounterService encounterService,
                                   EncounterDetailService encounterDetailService,
                                   PatientPortalServiceImpl portalService) {
        this.userAccountRepository = userAccountRepository;
        this.appointmentService = appointmentService;
        this.encounterService = encounterService;
        this.encounterDetailService = encounterDetailService;
        this.portalService = portalService;
    }

    // --- HELPER: Lấy Patient ID từ Token ---
    private Long getCurrentPatientId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 1. Kiểm tra đăng nhập
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Chưa đăng nhập hoặc Token không hợp lệ");
        }

        Object principal = authentication.getPrincipal();
        String username;

        // 2. Lấy username từ Principal (Xử lý đa dạng các trường hợp)
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            username = (String) principal;
        } else {
            throw new RuntimeException("Không xác định được loại tài khoản (Principal type mismatch)");
        }

        // 3. Truy vấn Database để lấy thông tin mới nhất
        UserAccount ua = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + username));

        if (ua.getPatientId() == null) {
            throw new RuntimeException("Tài khoản này không liên kết với hồ sơ bệnh nhân!");
        }

        return ua.getPatientId();
    }

    // 1. Xem lịch sử khám bệnh
    @GetMapping("/encounters")
    public ResponseEntity<List<EncounterResponse>> getMyEncounters() {
        Long patientId = getCurrentPatientId();
        // Cần thêm hàm findByPatientId trong EncounterService
        return ResponseEntity.ok(encounterService.getHistoryByPatient(patientId));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentDetailDto>> getMyAppointments(
            @RequestParam(defaultValue = "upcoming") String view // "upcoming" hoặc "all"
    ) {
        Long patientId = getCurrentPatientId();

        if ("all".equals(view)) {
            return ResponseEntity.ok(appointmentService.getAllByPatient(patientId));
        } else {
            return ResponseEntity.ok(appointmentService.getUpcomingByPatient(patientId));
        }
    }

    // 3. Đặt lịch hẹn mới (Dành cho BN tự đặt)
    @PostMapping("/appointments")
    public ResponseEntity<AppointmentDetailDto> bookAppointment(@RequestBody AppointmentRequest req) {
        System.out.println("hehe");
        Long patientId = getCurrentPatientId();
        System.out.println(patientId);
        req.setPatientId(patientId); // Cưỡng chế set ID là chính mình
        return ResponseEntity.ok(appointmentService.create(req));
    }

    //4.ch tiet encounter
    @GetMapping("/encounters/{id}")
    public ResponseEntity<EncounterDetailResponse> getEncounterDetail(@PathVariable Long id) {
        EncounterDetailResponse dto = encounterDetailService.getEncounterDetail(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/account/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        portalService.changePassword(request);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    // API: Cập nhật thông tin cá nhân
    @PutMapping("/account/profile")
    public ResponseEntity<CurrentUserResponse> updateProfile(@RequestBody PatientProfileUpdateRequest request) {
        CurrentUserResponse updatedProfile = portalService.updateMyProfile(request);
        return ResponseEntity.ok(updatedProfile);
    }
}