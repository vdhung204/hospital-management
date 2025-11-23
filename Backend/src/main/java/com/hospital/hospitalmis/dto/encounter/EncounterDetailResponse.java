package com.hospital.hospitalmis.dto.encounter;

import com.hospital.hospitalmis.dto.ClinicalNoteResponse;
import com.hospital.hospitalmis.dto.DiagnosisResponse;
import com.hospital.hospitalmis.dto.clinical_result.ImagingResultResponse;
import com.hospital.hospitalmis.dto.clinical_result.LabResultResponse;
import com.hospital.hospitalmis.dto.invoice.InvoiceDetailResponse;
import com.hospital.hospitalmis.dto.prescription.PrescriptionDetailDto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class EncounterDetailResponse {

    // Thông tin Encounter
    private Long id;
    private String encounterType;
    private LocalDateTime visitDate;
    private String status;

    // Thông tin bệnh nhân
    public static class PatientSummary {
        private Long id;
        private String patientCode;
        private String fullName;
        private LocalDate dateOfBirth;
        private String gender;
        private String phone;
        private String address;

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
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }

    // Thông tin khoa
    public static class DepartmentSummary {
        private Long id;
        private String code;
        private String name;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    // Item y lệnh kèm kết quả
    public static class OrderItemWithResults {
        private Long id;
        private String itemType;
        private Long serviceItemId;
        private String serviceItemName;

        private Long labTestId;
        private String labTestName;

        private Long imagingProcedureId;
        private String imagingProcedureName;

        private String status;

        private List<LabResultResponse> labResults;
        private List<ImagingResultResponse> imagingResults;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getItemType() { return itemType; }
        public void setItemType(String itemType) { this.itemType = itemType; }
        public Long getServiceItemId() { return serviceItemId; }
        public void setServiceItemId(Long serviceItemId) { this.serviceItemId = serviceItemId; }
        public String getServiceItemName() { return serviceItemName; }
        public void setServiceItemName(String serviceItemName) { this.serviceItemName = serviceItemName; }
        public Long getLabTestId() { return labTestId; }
        public void setLabTestId(Long labTestId) { this.labTestId = labTestId; }
        public String getLabTestName() { return labTestName; }
        public void setLabTestName(String labTestName) { this.labTestName = labTestName; }
        public Long getImagingProcedureId() { return imagingProcedureId; }
        public void setImagingProcedureId(Long imagingProcedureId) { this.imagingProcedureId = imagingProcedureId; }
        public String getImagingProcedureName() { return imagingProcedureName; }
        public void setImagingProcedureName(String imagingProcedureName) { this.imagingProcedureName = imagingProcedureName; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public List<LabResultResponse> getLabResults() { return labResults; }
        public void setLabResults(List<LabResultResponse> labResults) { this.labResults = labResults; }
        public List<ImagingResultResponse> getImagingResults() { return imagingResults; }
        public void setImagingResults(List<ImagingResultResponse> imagingResults) { this.imagingResults = imagingResults; }
    }

    public static class ClinicalOrderBlock {
        private Long id;
        private Long encounterId;
        private Long orderedBy;
        private String status;
        private LocalDateTime createdAt;
        private List<OrderItemWithResults> items;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getEncounterId() { return encounterId; }
        public void setEncounterId(Long encounterId) { this.encounterId = encounterId; }
        public Long getOrderedBy() { return orderedBy; }
        public void setOrderedBy(Long orderedBy) { this.orderedBy = orderedBy; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public List<OrderItemWithResults> getItems() { return items; }
        public void setItems(List<OrderItemWithResults> items) { this.items = items; }
    }

    private PatientSummary patient;
    private DepartmentSummary department;
    private Long doctorId;

    private java.util.List<ClinicalNoteResponse> notes;
    private java.util.List<DiagnosisResponse> diagnoses;
    private java.util.List<ClinicalOrderBlock> orders;
    private java.util.List<PrescriptionDetailDto> prescriptions;
    private java.util.List<InvoiceDetailResponse> invoices;


    // getters/setters encounter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEncounterType() { return encounterType; }
    public void setEncounterType(String encounterType) { this.encounterType = encounterType; }
    public LocalDateTime getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDateTime visitDate) { this.visitDate = visitDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public PatientSummary getPatient() { return patient; }
    public void setPatient(PatientSummary patient) { this.patient = patient; }

    public DepartmentSummary getDepartment() { return department; }
    public void setDepartment(DepartmentSummary department) { this.department = department; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public java.util.List<ClinicalNoteResponse> getNotes() { return notes; }
    public void setNotes(java.util.List<ClinicalNoteResponse> notes) { this.notes = notes; }

    public java.util.List<DiagnosisResponse> getDiagnoses() { return diagnoses; }
    public void setDiagnoses(java.util.List<DiagnosisResponse> diagnoses) { this.diagnoses = diagnoses; }

    public java.util.List<ClinicalOrderBlock> getOrders() { return orders; }
    public void setOrders(java.util.List<ClinicalOrderBlock> orders) { this.orders = orders; }

    public List<PrescriptionDetailDto> getPrescriptions() {
        return prescriptions;
    }

    public void setPrescriptions(List<PrescriptionDetailDto> prescriptions) {
        this.prescriptions = prescriptions;
    }

    public List<InvoiceDetailResponse> getInvoices() {
        return invoices;
    }

    public void setInvoices(List<InvoiceDetailResponse> invoices) {
        this.invoices = invoices;
    }
}
