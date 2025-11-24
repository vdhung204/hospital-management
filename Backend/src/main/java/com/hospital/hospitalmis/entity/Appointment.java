package com.hospital.hospitalmis.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointment")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK patient
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // FK department
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    // FK staff (bác sĩ), có thể null
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Staff doctor;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    // SCHEDULED, DONE, CANCELLED, NO_SHOW
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    // ===== getters/setters =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public Staff getDoctor() { return doctor; }
    public void setDoctor(Staff doctor) { this.doctor = doctor; }

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}