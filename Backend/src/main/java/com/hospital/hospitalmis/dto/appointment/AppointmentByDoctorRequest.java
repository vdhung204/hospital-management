package com.hospital.hospitalmis.dto.appointment;

import java.time.LocalDateTime;

// dùng cho bệnh nhân đặt lịch theo bác sĩ
public class AppointmentByDoctorRequest {
    private Long doctorId;
    private LocalDateTime scheduledAt;

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
}
