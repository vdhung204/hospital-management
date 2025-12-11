package com.hospital.hospitalmis.dto.master;

import lombok.Data;
import java.time.LocalDate;

@Data
public class StaffResponse {
    private Long id;
    private String staffCode;
    private String fullName;
    private String gender;       // "M" / "F"
    private LocalDate dateOfBirth;
    private String phone;
    private String email;
    private String address;

    private String staffType;    // DOCTOR, NURSE...
    private String position;     // Trưởng khoa, Bác sĩ...

    // Thông tin liên kết (đã làm phẳng)
    private String departmentName; // Thay vì trả về cả object Department
    private Long departmentId;

    private String username;       // Lấy từ UserAccount
    private boolean isActive;
    private LocalDate hireDate;
}