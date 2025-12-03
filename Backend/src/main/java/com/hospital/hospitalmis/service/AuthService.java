package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.auth.CurrentUserResponse;
import com.hospital.hospitalmis.dto.auth.PatientRegisterRequest;
import com.hospital.hospitalmis.dto.auth.LoginResponse;
import com.hospital.hospitalmis.dto.auth.StaffRegisterRequest;
import com.hospital.hospitalmis.dto.exception.AppException;
import com.hospital.hospitalmis.entity.*;
import com.hospital.hospitalmis.repository.*;
import com.hospital.hospitalmis.security.CustomUserDetails;
import com.hospital.hospitalmis.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PatientRepository patientRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;

    public AuthService(UserAccountRepository userAccountRepository,
                       PatientRepository patientRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       StaffRepository staffRepository,
                       DepartmentRepository departmentRepository) {
        this.userAccountRepository = userAccountRepository;
        this.patientRepository = patientRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.staffRepository = staffRepository;
        this.departmentRepository = departmentRepository;
    }

    public LoginResponse registerPatient(PatientRegisterRequest req) {

        // 1. Check username
        if (userAccountRepository.findByUsername(req.getUsername()).isPresent()) {
            throw new AppException(401, "Username already taken");
        }

        // 2. Sinh patient_code TRƯỚC
        String newCode = generateNewPatientCode();

        // 3. Tạo patient (đặt patientCode ngay từ đầu)
        Patient patient = new Patient();
        patient.setPatientCode(newCode);                 // QUAN TRỌNG: không để null
        patient.setFullName(req.getFullName());
        patient.setDateOfBirth(req.getDateOfBirth());
        patient.setGender(req.getGender());
        patient.setPhone(req.getPhone());
        patient.setIdNumber(req.getIdNumber());
        patient.setAddress(req.getAddress());
        // nếu entity có createdAt thì set:
        // patient.setCreatedAt(LocalDateTime.now());

        Patient savedPatient = patientRepository.save(patient);

        // 4. Tạo user_account
        UserAccount user = new UserAccount();
        user.setUsername(req.getUsername());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setIsActive(true);
        user.setPatientId(savedPatient.getId());

        Role patientRole = roleRepository.findByCode("PATIENT")
                .orElseThrow(() -> new RuntimeException("Role PATIENT not found"));

        user.getRoles().add(patientRole);

        UserAccount savedUser = userAccountRepository.save(user);

        // 5. Tạo token & response
        List<String> roles = List.of("ROLE_PATIENT");
        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getUsername(), roles);

        LoginResponse res = new LoginResponse();
        res.setAccessToken(token);
        res.setUserId(savedUser.getId());
        res.setUsername(savedUser.getUsername());
        res.setPatientId(savedPatient.getId());
        res.setRoles(roles);
        res.setFullName(savedPatient.getFullName());

        return res;
    }
    public LoginResponse registerStaff(StaffRegisterRequest req) {

        // 1. Check username trùng
        if (userAccountRepository.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken");
        }

        // 2. Lấy role theo staffType (staffType = role.code)
        String staffType = req.getStaffType(); // VD: "DOCTOR", "NURSE", ...
        Role role = roleRepository.findByCode(staffType)
                .orElseThrow(() -> new RuntimeException("Role not found: " + staffType));

        // 3. Tạo user_account
        UserAccount user = new UserAccount();
        user.setUsername(req.getUsername());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setIsActive(true);
        user.setPatientId(null);

        user.getRoles().add(role);

        UserAccount savedUser = userAccountRepository.save(user);

        // 4. Tạo staff
        Staff staff = new Staff();
        staff.setUser(savedUser);
        staff.setStaffCode(generateStaffCode(staffType));
        staff.setFullName(req.getFullName());
        staff.setGender(req.getGender());
        staff.setDateOfBirth(req.getDateOfBirth());
        staff.setPhone(req.getPhone());
        staff.setEmail(req.getEmail());
        staff.setIdNumber(req.getIdNumber());
        staff.setAddress(req.getAddress());
        staff.setStaffType(staffType);
        staff.setPosition(req.getPosition());
        staff.setHireDate(req.getHireDate());
        staff.setIsActive(true);

        if (req.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(req.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            staff.setDepartment(dept);
        }

        Staff savedStaff = staffRepository.save(staff);

        // 5. Token + response
        String roleCode = role.getCode(); // chính là staffType
        List<String> roles = List.of("ROLE_" + roleCode);
        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getUsername(), roles);

        LoginResponse res = new LoginResponse();
        res.setAccessToken(token);
        res.setUserId(savedUser.getId());
        res.setUsername(savedUser.getUsername());
        res.setPatientId(null);
        res.setRoles(roles);
        res.setFullName(savedStaff.getFullName());

        return res;
    }
    public CurrentUserResponse getCurrentUserProfile(CustomUserDetails userDetails) {

        CurrentUserResponse res = new CurrentUserResponse();
        res.setUserId(userDetails.getUserId());
        res.setUsername(userDetails.getUsername());

        // lấy list roles dạng "ROLE_XXX"
        List<String> roles = userDetails.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .toList();
        res.setRoles(roles);

        Long patientId = userDetails.getPatientId();

        // ==== 1. Nếu là account bệnh nhân (có patient_id) ====
        if (patientId != null) {
            Patient patient = patientRepository.findById(patientId)
                    .orElse(null);

            if (patient != null) {
                CurrentUserResponse.PatientInfo p = new CurrentUserResponse.PatientInfo();
                p.setId(patient.getId());
                p.setPatientCode(patient.getPatientCode());
                p.setFullName(patient.getFullName());
                p.setDateOfBirth(patient.getDateOfBirth());
                p.setGender(patient.getGender());
                p.setPhone(patient.getPhone());
                p.setIdNumber(patient.getIdNumber());
                p.setAddress(patient.getAddress());

                res.setPatient(p);
                res.setFullName(patient.getFullName());
                res.setAccountType("PATIENT");
                return res;
            }
        }

        // ==== 2. Nếu không có patient → thử tìm staff ====
        Staff staff = staffRepository.findByUser_Id(userDetails.getUserId())
                .orElse(null);

        if (staff != null) {
            CurrentUserResponse.StaffInfo s = new CurrentUserResponse.StaffInfo();
            s.setId(staff.getId());
            s.setStaffCode(staff.getStaffCode());
            s.setFullName(staff.getFullName());
            s.setStaffType(staff.getStaffType());
            s.setPosition(staff.getPosition());
            s.setPhone(staff.getPhone());
            s.setEmail(staff.getEmail());

            Department dept = staff.getDepartment();
            if (dept != null) {
                s.setDepartmentId(dept.getId());
                s.setDepartmentCode(dept.getCode());
                s.setDepartmentName(dept.getName());
            }

            res.setStaff(s);
            res.setFullName(staff.getFullName());
            res.setAccountType("STAFF");
            return res;
        }

        // ==== 3. Nếu không phải patient cũng không có staff (user kỹ thuật) ====
        res.setFullName(userDetails.getUsername());
        res.setAccountType("OTHER");

        return res;
    }

    private String generateNewPatientCode() {
        Long maxId = patientRepository.findMaxId();   // vd: 2
        long next = (maxId == null ? 1L : maxId + 1); // -> 3
        return String.format("P%04d", next);          // -> "P0003"
    }
    private String generateStaffCode(String staffType) {
        Long maxId = staffRepository.findMaxId();
        long next = (maxId == null ? 1L : maxId + 1);

        if (staffType == null || staffType.isBlank()) {
            // fallback nếu lỡ truyền null
            return String.format("S%04d", next);
        }

        // Nếu lỡ truyền dạng "ROLE_DOCTOR" thì cắt bỏ "ROLE_"
        String normalized = staffType;
        if (normalized.startsWith("ROLE_")) {
            normalized = normalized.substring(5); // bỏ "ROLE_"
        }

        // lấy chữ cái đầu, chuyển uppercase
        String prefix = normalized.substring(0, 1).toUpperCase();

        return String.format("%s%04d", prefix, next); // ví dụ D0001, N0002, A0003, ...
    }
}
