package com.hospital.hospitalmis.service.impl;

import com.hospital.hospitalmis.dto.account.ChangePasswordRequest;
import com.hospital.hospitalmis.dto.account.PatientProfileUpdateRequest;
import com.hospital.hospitalmis.dto.auth.CurrentUserResponse;
import com.hospital.hospitalmis.entity.Patient;
import com.hospital.hospitalmis.entity.UserAccount;
import com.hospital.hospitalmis.repository.PatientRepository;
import com.hospital.hospitalmis.repository.UserAccountRepository;
import com.hospital.hospitalmis.service.AuthService;
import com.hospital.hospitalmis.security.SecurityUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PatientPortalServiceImpl {

    private final UserAccountRepository userAccountRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUtils securityUtils;
    private final AuthService authService; // Tái sử dụng logic lấy profile có sẵn

    public PatientPortalServiceImpl(UserAccountRepository userAccountRepository,
                                    PatientRepository patientRepository,
                                    PasswordEncoder passwordEncoder,
                                    SecurityUtils securityUtils,
                                    AuthService authService) {
        this.userAccountRepository = userAccountRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.securityUtils = securityUtils;
        this.authService = authService;
    }

    /**
     * Đổi mật khẩu cho user đang đăng nhập
     */
    public void changePassword(ChangePasswordRequest req) {
        // 1. Lấy User hiện tại
        Long userId = securityUtils.getCurrentUserId();
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }

        // 3. Kiểm tra confirm password
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp");
        }

        // 4. Lưu mật khẩu mới
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userAccountRepository.save(user);
    }

    /**
     * Cập nhật thông tin cá nhân (Chỉ update các trường cho phép)
     */
    public CurrentUserResponse updateMyProfile(PatientProfileUpdateRequest req) {
        // 1. Lấy User hiện tại để tìm PatientId
        Long userId = securityUtils.getCurrentUserId();
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getPatientId() == null) {
            throw new RuntimeException("Tài khoản này không liên kết với hồ sơ bệnh nhân");
        }

        // 2. Lấy Patient Entity
        Patient patient = patientRepository.findById(user.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        // 3. Update dữ liệu (tham chiếu các trường từ PatientService.update )
        if (req.getFullName() != null) patient.setFullName(req.getFullName());
        if (req.getPhone() != null) patient.setPhone(req.getPhone());
        if (req.getAddress() != null) patient.setAddress(req.getAddress());
        if (req.getDateOfBirth() != null) patient.setDateOfBirth(req.getDateOfBirth());
        if (req.getGender() != null) patient.setGender(req.getGender());
        if (req.getIdNumber() != null) patient.setIdNumber(req.getIdNumber());

        // Lưu xuống DB
        patientRepository.save(patient);

        // 4. Trả về Profile mới nhất (Tận dụng logic mapping của AuthService )
        // Chúng ta cần mock một CustomUserDetails hoặc sửa AuthService để public hàm mapping riêng
        // Ở đây tôi gọi hàm getById để lấy lại entity và tự map đơn giản hoặc gọi AuthService nếu có thể
        return convertPatientToProfile(user, patient);
    }

    // Helper mapping (Tương tự logic trong AuthService [cite: 644-646])
    private CurrentUserResponse convertPatientToProfile(UserAccount user, Patient patient) {
        CurrentUserResponse res = new CurrentUserResponse();
        res.setUserId(user.getId());
        res.setUsername(user.getUsername());
        res.setFullName(patient.getFullName());
        res.setAccountType("PATIENT");

        CurrentUserResponse.PatientInfo pInfo = new CurrentUserResponse.PatientInfo();
        pInfo.setId(patient.getId());
        pInfo.setPatientCode(patient.getPatientCode());
        pInfo.setFullName(patient.getFullName());
        pInfo.setPhone(patient.getPhone());
        pInfo.setAddress(patient.getAddress());
        pInfo.setDateOfBirth(patient.getDateOfBirth());
        pInfo.setGender(patient.getGender());
        pInfo.setIdNumber(patient.getIdNumber());

        res.setPatient(pInfo);
        return res;
    }
}