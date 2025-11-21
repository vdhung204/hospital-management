package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.auth.*;
import com.hospital.hospitalmis.entity.Patient;
import com.hospital.hospitalmis.entity.UserAccount;
import com.hospital.hospitalmis.repository.PatientRepository;
import com.hospital.hospitalmis.repository.StaffRepository;
import com.hospital.hospitalmis.repository.UserAccountRepository;
import com.hospital.hospitalmis.security.CustomUserDetails;
import com.hospital.hospitalmis.security.JwtUtil;
import com.hospital.hospitalmis.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final PatientRepository patientRepository;
    private final StaffRepository staffRepository;
    private final AuthService authService;


    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserAccountRepository userAccountRepository,
                          PasswordEncoder passwordEncoder,
                          PatientRepository patientRepository,
                          StaffRepository staffRepository,
                          AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.patientRepository = patientRepository;
        this.staffRepository = staffRepository;
        this.authService = authService;
    }

    @PostMapping("/register/patient")
    public ResponseEntity<LoginResponse> registerPatient(
            @RequestBody PatientRegisterRequest request
    ) {
        LoginResponse res = authService.registerPatient(request);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/admin/register/staff")
    public ResponseEntity<LoginResponse> registerStaff(
            @RequestBody StaffRegisterRequest request
    ) {
        LoginResponse res = authService.registerStaff(request);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority) // "ROLE_DOCTOR"
                .collect(Collectors.toList());

        String token = jwtUtil.generateToken(
                userDetails.getUserId(),
                userDetails.getUsername(),
                roles
        );

        LoginResponse res = new LoginResponse();
        res.setAccessToken(token);
        res.setUserId(userDetails.getUserId());
        res.setUsername(userDetails.getUsername());
        res.setPatientId(userDetails.getPatientId());
        res.setRoles(roles);
        String fullName = null;

        // 1. Nếu là tài khoản cổng bệnh nhân → lấy tên từ bảng patient
        Long patientId = userDetails.getPatientId();
        if (patientId != null) {
            fullName = patientRepository.findById(patientId)
                    .map(Patient::getFullName)
                    .orElse(null);
        }

        // 2. Nếu không phải patient portal → thử tìm trong staff
        if (fullName == null) {
            fullName = staffRepository.findByUser_Id(userDetails.getUserId())
                    .map(staff -> staff.getFullName())
                    .orElse(null);
        }

        // 3. Nếu vẫn null (user kỹ thuật, chưa gắn staff/patient) → fallback username
        if (fullName == null) {
            fullName = userDetails.getUsername();
        }

        res.setFullName(fullName);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> me(Authentication authentication) {
        // Spring Security đã parse JWT -> Authentication -> CustomUserDetails
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        CurrentUserResponse res = authService.getCurrentUserProfile(userDetails);
        return ResponseEntity.ok(res);
    }
}
