package com.hospital.hospitalmis.dto.auth;

import java.time.LocalDate;
import java.util.List;

public class CurrentUserResponse {

    private Long userId;
    private String username;
    private String fullName;

    // "PATIENT" / "STAFF" / "OTHER"
    private String accountType;

    private List<String> roles;

    // --- Thông tin bệnh nhân (nếu là patient portal) ---
    public static class PatientInfo {
        private Long id;
        private String patientCode;
        private String fullName;
        private LocalDate dateOfBirth;
        private String gender;
        private String phone;
        private String idNumber;
        private String address;

        // getters/setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getPatientCode() { return patientCode; }
        public void setPatientCode(String patientCode) { this.patientCode = patientCode; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public LocalDate getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getIdNumber() { return idNumber; }
        public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }

    // --- Thông tin nhân viên (nếu là user staff) ---
    public static class StaffInfo {
        private Long id;
        private String staffCode;
        private String fullName;
        private String staffType;    // DOCTOR / NURSE / CASHIER / ADMIN...
        private String position;     // Bác sĩ CKI, Điều dưỡng...

        private Long departmentId;
        private String departmentCode;
        private String departmentName;

        private String phone;
        private String email;

        // getters/setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getStaffCode() { return staffCode; }
        public void setStaffCode(String staffCode) { this.staffCode = staffCode; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getStaffType() { return staffType; }
        public void setStaffType(String staffType) { this.staffType = staffType; }

        public String getPosition() { return position; }
        public void setPosition(String position) { this.position = position; }

        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

        public String getDepartmentCode() { return departmentCode; }
        public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    private PatientInfo patient;
    private StaffInfo staff;

    // ===== getters/setters top-level =====
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }

    public PatientInfo getPatient() { return patient; }
    public void setPatient(PatientInfo patient) { this.patient = patient; }

    public StaffInfo getStaff() { return staff; }
    public void setStaff(StaffInfo staff) { this.staff = staff; }
}
