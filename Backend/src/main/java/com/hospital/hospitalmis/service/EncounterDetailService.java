package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.*;
import com.hospital.hospitalmis.dto.clinical_result.ImagingResultResponse;
import com.hospital.hospitalmis.dto.clinical_result.LabResultResponse;
import com.hospital.hospitalmis.dto.encounter.EncounterDetailResponse;
import com.hospital.hospitalmis.dto.invoice.InvoiceDetailResponse;
import com.hospital.hospitalmis.dto.prescription.PrescriptionDetailDto;
import com.hospital.hospitalmis.entity.*;
import com.hospital.hospitalmis.repository.*;
import org.springframework.stereotype.Service;

import java.io.Console;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EncounterDetailService {

    private final EncounterRepository encounterRepository;
    private final ClinicalNoteRepository clinicalNoteRepository;
    private final EncounterDiagnosisRepository encounterDiagnosisRepository;
    private final ClinicalOrderRepository clinicalOrderRepository;
    private final ClinicalOrderItemRepository clinicalOrderItemRepository;
    private final LabResultRepository labResultRepository;
    private final ImagingResultRepository imagingResultRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final LabTestRepository labTestRepository;
    private final ImagingProcedureRepository imagingProcedureRepository;
    private final PrescriptionService prescriptionService;
    private final BillingService billingService;
    private final StaffService staffService;
    private final StaffRepository staffRepository;


    public EncounterDetailService(EncounterRepository encounterRepository,
                                  ClinicalNoteRepository clinicalNoteRepository,
                                  EncounterDiagnosisRepository encounterDiagnosisRepository,
                                  ClinicalOrderRepository clinicalOrderRepository,
                                  ClinicalOrderItemRepository clinicalOrderItemRepository,
                                  LabResultRepository labResultRepository,
                                  ImagingResultRepository imagingResultRepository,
                                  ServiceItemRepository serviceItemRepository,
                                  LabTestRepository labTestRepository,
                                  ImagingProcedureRepository imagingProcedureRepository,
                                  PrescriptionService prescriptionService,
                                  BillingService billingService,
                                  StaffService staffService, StaffRepository staffRepository) {
        this.encounterRepository = encounterRepository;
        this.clinicalNoteRepository = clinicalNoteRepository;
        this.encounterDiagnosisRepository = encounterDiagnosisRepository;
        this.clinicalOrderRepository = clinicalOrderRepository;
        this.clinicalOrderItemRepository = clinicalOrderItemRepository;
        this.labResultRepository = labResultRepository;
        this.imagingResultRepository = imagingResultRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.labTestRepository = labTestRepository;
        this.imagingProcedureRepository = imagingProcedureRepository;
        this.prescriptionService = prescriptionService;
        this.billingService = billingService;
        this.staffService = staffService;
        this.staffRepository = staffRepository;
    }

    public EncounterDetailResponse getEncounterDetail(Long encounterId) {
        Encounter enc = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new RuntimeException("Encounter not found"));

        EncounterDetailResponse dto = new EncounterDetailResponse();
        dto.setId(enc.getId());
        dto.setEncounterType(enc.getEncounterType());
        dto.setVisitDate(enc.getVisitDate());
        dto.setStatus(enc.getStatus());
        dto.setDoctorId(enc.getDoctorId());
        dto.setQueueNumber(enc.getQueueNumber());
        dto.setHeight(enc.getHeight());
        dto.setWeight(enc.getWeight());
        dto.setBloodPressure(enc.getBloodPressure());
        dto.setTemperature(enc.getTemperature());
        dto.setPulse(enc.getPulse());

        // -------- Patient summary ----------
        if (enc.getPatient() != null) {
            EncounterDetailResponse.PatientSummary p = new EncounterDetailResponse.PatientSummary();
            p.setId(enc.getPatient().getId());
            p.setPatientCode(enc.getPatient().getPatientCode());
            p.setFullName(enc.getPatient().getFullName());
            p.setDateOfBirth(enc.getPatient().getDateOfBirth());
            p.setGender(enc.getPatient().getGender());
            p.setPhone(enc.getPatient().getPhone());
            p.setAddress(enc.getPatient().getAddress());
            dto.setPatient(p);
        }

        // -------- Department summary ----------
        if (enc.getDepartment() != null) {
            EncounterDetailResponse.DepartmentSummary d = new EncounterDetailResponse.DepartmentSummary();
            d.setId(enc.getDepartment().getId());
            d.setCode(enc.getDepartment().getCode());
            d.setName(enc.getDepartment().getName());
            dto.setDepartment(d);
        }

        // -------- Clinical notes ----------
        List<ClinicalNote> notes = clinicalNoteRepository
                .findByEncounter_IdOrderByCreatedAtAsc(encounterId);
        List<ClinicalNoteResponse> noteDtos = notes.stream()
                .map(this::mapNoteToResponse)
                .collect(Collectors.toList());
        dto.setNotes(noteDtos);

        // -------- Diagnoses ----------
        List<EncounterDiagnosis> diags =
                encounterDiagnosisRepository.findByEncounter_Id(encounterId);
        List<DiagnosisResponse> diagDtos = diags.stream()
                .map(this::mapDiagToResponse)
                .collect(Collectors.toList());
        dto.setDiagnoses(diagDtos);

        // -------- Orders + items + results ----------
        List<ClinicalOrder> orders =
                clinicalOrderRepository.findByEncounter_Id(encounterId);
        List<EncounterDetailResponse.ClinicalOrderBlock> orderBlocks = orders.stream()
                .map(this::mapOrderToBlock)
                .collect(Collectors.toList());
        dto.setOrders(orderBlocks);

        // -------- Prescriptions (đơn thuốc) ----------
        List<PrescriptionDetailDto> presDtos =
                prescriptionService.getByEncounter(encounterId);
        dto.setPrescriptions(presDtos);

        // -------- Invoices + payments ----------
        List<InvoiceDetailResponse> invoices =
                billingService.getInvoicesByEncounter(encounterId);
        dto.setInvoices(invoices);

        return dto;
    }

    // ============= Mapping helpers =============

    private ClinicalNoteResponse mapNoteToResponse(ClinicalNote n) {
        Staff createByName = staffRepository.findByUser_Id(n.getCreatedBy()).orElse(null);
        ClinicalNoteResponse dto = new ClinicalNoteResponse();
        dto.setId(n.getId());
        dto.setEncounterId(n.getEncounter().getId());
        dto.setNoteType(n.getNoteType());
        dto.setContent(n.getContent());
        dto.setCreatedBy(n.getCreatedBy());
        if (createByName != null) {
            dto.setCreatedByName(createByName.getFullName());
        }
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }

    private DiagnosisResponse mapDiagToResponse(EncounterDiagnosis d) {
        DiagnosisResponse dto = new DiagnosisResponse();
        dto.setId(d.getId());
        dto.setEncounterId(d.getEncounter().getId());
        if (d.getIcd10Code() != null) {
            dto.setIcd10Code(d.getIcd10Code().getCode());
            dto.setIcd10Name(d.getIcd10Code().getName());
        }
        dto.setPrimary(d.getIsPrimary());
        return dto;
    }

    private EncounterDetailResponse.ClinicalOrderBlock mapOrderToBlock(ClinicalOrder o) {
        EncounterDetailResponse.ClinicalOrderBlock block =
                new EncounterDetailResponse.ClinicalOrderBlock();
        block.setId(o.getId());
        block.setEncounterId(o.getEncounter().getId());
        block.setOrderedBy(o.getOrderedBy());
        block.setStatus(o.getStatus());
        block.setCreatedAt(o.getCreatedAt());

        List<ClinicalOrderItem> items =
                clinicalOrderItemRepository.findByClinicalOrder_Id(o.getId());

        List<EncounterDetailResponse.OrderItemWithResults> itemDtos = items.stream()
                .map(this::mapOrderItemWithResults)
                .collect(Collectors.toList());
        block.setItems(itemDtos);

        return block;
    }

    private EncounterDetailResponse.OrderItemWithResults mapOrderItemWithResults(ClinicalOrderItem item) {
        EncounterDetailResponse.OrderItemWithResults dto =
                new EncounterDetailResponse.OrderItemWithResults();

        dto.setId(item.getId());
        dto.setItemType(item.getItemType());
        dto.setServiceItemId(item.getServiceItemId());
        dto.setLabTestId(item.getLabTestId());
        dto.setImagingProcedureId(item.getImagingProcedureId());
        dto.setStatus(item.getStatus());

        serviceItemRepository.findById(item.getServiceItemId())
                .ifPresent(si -> dto.setServiceItemName(si.getName()));

        if (item.getLabTestId() != null) {
            labTestRepository.findById(item.getLabTestId())
                    .ifPresent(lt -> dto.setLabTestName(lt.getName()));
        }

        if (item.getImagingProcedureId() != null) {
            imagingProcedureRepository.findById(item.getImagingProcedureId())
                    .ifPresent(ip -> dto.setImagingProcedureName(ip.getName()));
        }

        // Lab results
        List<LabResult> labResults =
                labResultRepository.findByClinicalOrderItem_Id(item.getId());
        List<LabResultResponse> labDtos = labResults.stream()
                .map(this::mapLabResultToResponse)
                .collect(Collectors.toList());
        dto.setLabResults(labDtos);

        // Imaging results
        List<ImagingResult> imgResults =
                imagingResultRepository.findByClinicalOrderItem_Id(item.getId());
        List<ImagingResultResponse> imgDtos = imgResults.stream()
                .map(this::mapImagingResultToResponse)
                .collect(Collectors.toList());
        dto.setImagingResults(imgDtos);

        return dto;
    }

    private LabResultResponse mapLabResultToResponse(LabResult lr) {
        LabResultResponse dto = new LabResultResponse();
        dto.setId(lr.getId());
        dto.setClinicalOrderItemId(lr.getClinicalOrderItem().getId());
        dto.setParameterName(lr.getParameterName());
        dto.setResultValue(lr.getResultValue());
        dto.setUnit(lr.getUnit());
        dto.setRefLow(lr.getRefLow());
        dto.setRefHigh(lr.getRefHigh());
        dto.setAbnormalFlag(lr.getAbnormalFlag());
        dto.setValidatedBy(lr.getValidatedBy());
        dto.setValidatedAt(lr.getValidatedAt());
        return dto;
    }

    private ImagingResultResponse mapImagingResultToResponse(ImagingResult ir) {
        ImagingResultResponse dto = new ImagingResultResponse();
        dto.setId(ir.getId());
        dto.setClinicalOrderItemId(ir.getClinicalOrderItem().getId());
        dto.setReportText(ir.getReportText());
        dto.setImpression(ir.getImpression());
        dto.setRadiologistId(ir.getRadiologistId());
        dto.setPacsStudyUid(ir.getPacsStudyUid());
        dto.setViewerUrl(ir.getViewerUrl());
        return dto;
    }
}
