package com.hospital.hospitalmis.dto.clinical_result;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ClinicalOrderItemResponse {

    private Long id;
    private String itemType;
    private Long serviceItemId;
    private String serviceItemName;
    private Long labTestId;
    private String labTestName;
    private Long imagingProcedureId;
    private String imagingProcedureName;
    private String status;

    private String patientName;
    private String patientCode;
    private String patientGender;
    private LocalDate patientDob;

    private String doctorName;
    private LocalDateTime orderedAt;
    // getters/setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public Long getServiceItemId() {
        return serviceItemId;
    }

    public void setServiceItemId(Long serviceItemId) {
        this.serviceItemId = serviceItemId;
    }

    public String getServiceItemName() {
        return serviceItemName;
    }

    public void setServiceItemName(String serviceItemName) {
        this.serviceItemName = serviceItemName;
    }

    public Long getLabTestId() {
        return labTestId;
    }

    public void setLabTestId(Long labTestId) {
        this.labTestId = labTestId;
    }

    public String getLabTestName() {
        return labTestName;
    }

    public void setLabTestName(String labTestName) {
        this.labTestName = labTestName;
    }

    public Long getImagingProcedureId() {
        return imagingProcedureId;
    }

    public void setImagingProcedureId(Long imagingProcedureId) {
        this.imagingProcedureId = imagingProcedureId;
    }

    public String getImagingProcedureName() {
        return imagingProcedureName;
    }

    public void setImagingProcedureName(String imagingProcedureName) {
        this.imagingProcedureName = imagingProcedureName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getOrderedAt() {
        return orderedAt;
    }

    public void setOrderedAt(LocalDateTime orderedAt) {
        this.orderedAt = orderedAt;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public LocalDate getPatientDob() {
        return patientDob;
    }

    public void setPatientDob(LocalDate patientDob) {
        this.patientDob = patientDob;
    }

    public String getPatientGender() {
        return patientGender;
    }

    public void setPatientGender(String patientGender) {
        this.patientGender = patientGender;
    }

    public String getPatientCode() {
        return patientCode;
    }

    public void setPatientCode(String patientCode) {
        this.patientCode = patientCode;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }
}
