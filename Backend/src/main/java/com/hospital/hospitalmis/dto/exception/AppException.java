package com.hospital.hospitalmis.dto.exception;

// AppException.java
public class AppException extends RuntimeException {
    private int errorCode;

    public AppException(int errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public int getErrorCode() {
        return errorCode;
    }
}