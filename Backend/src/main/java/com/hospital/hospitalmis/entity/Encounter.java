package com.hospital.hospitalmis.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "encounter")
public class Encounter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK tới Patient
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // FK tới Department (khoa khám)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    // Tạm thời dùng Long cho doctor_id, sau map sang Staff sau
    @Column(name = "doctor_id")
    private Long doctorId;

    @Column(name = "encounter_type", length = 20)
    private String encounterType;   // OPD, IPD,...

    @Column(name = "visit_date", nullable = false)
    private LocalDateTime visitDate;

    @Column(name = "status", length = 20)
    private String status;          // OPEN, COMPLETED,...

    @Column(name = "queue_number")
    private Integer queueNumber;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    // Sinh hiệu
    private Double height;
    private Double weight;
    private Double temperature;

    @Column(name = "blood_pressure",nullable = true)
    private String bloodPressure;
    @Column(name = "pulse",nullable = true)
    private Integer pulse;

    // Link với Appointment
    @OneToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getEncounterType() { return encounterType; }
    public void setEncounterType(String encounterType) { this.encounterType = encounterType; }

    public LocalDateTime getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDateTime visitDate) { this.visitDate = visitDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getQueueNumber() {
        return queueNumber;
    }

    public void setQueueNumber(Integer queueNumber) {
        this.queueNumber = queueNumber;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public String getBloodPressure() {
        return bloodPressure;
    }

    public void setBloodPressure(String bloodPressure) {
        this.bloodPressure = bloodPressure;
    }

    public Integer getPulse() {
        return pulse;
    }

    public void setPulse(Integer pulse) {
        this.pulse = pulse;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

}
