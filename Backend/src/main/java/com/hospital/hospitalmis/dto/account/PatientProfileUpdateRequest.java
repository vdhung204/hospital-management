
package com.hospital.hospitalmis.dto.account;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientProfileUpdateRequest {
    private String fullName;
    private String phone;
    private String email;
    private String address;
    private String gender;
    private LocalDate dateOfBirth;
    private String idNumber;
}