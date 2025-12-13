// File: ChangePasswordRequest.java
package com.hospital.hospitalmis.dto.account;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;
}