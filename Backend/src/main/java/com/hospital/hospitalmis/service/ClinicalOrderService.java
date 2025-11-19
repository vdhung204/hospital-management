package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.*;
import com.hospital.hospitalmis.dto.clinical_result.*;

import com.hospital.hospitalmis.entity.*;
import com.hospital.hospitalmis.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClinicalOrderService {

    private final ClinicalOrderRepository clinicalOrderRepository;
    private final ClinicalOrderItemRepository clinicalOrderItemRepository;
    private final EncounterRepository encounterRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final LabTestRepository labTestRepository;
    private final ImagingProcedureRepository imagingProcedureRepository;
    private final LabResultRepository labResultRepository;
    private final  ImagingResultRepository imagingResultRepository;

    public ClinicalOrderService(ClinicalOrderRepository clinicalOrderRepository,
                                ClinicalOrderItemRepository clinicalOrderItemRepository,
                                EncounterRepository encounterRepository,
                                ServiceItemRepository serviceItemRepository,
                                LabTestRepository labTestRepository,
                                ImagingProcedureRepository imagingProcedureRepository,
                                LabResultRepository labResultRepository,
                                ImagingResultRepository imagingResultRepository) {
        this.clinicalOrderRepository = clinicalOrderRepository;
        this.clinicalOrderItemRepository = clinicalOrderItemRepository;
        this.encounterRepository = encounterRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.labTestRepository = labTestRepository;
        this.imagingProcedureRepository = imagingProcedureRepository;
        this.labResultRepository = labResultRepository;
        this.imagingResultRepository = imagingResultRepository;
    }

    // ---------------- Tạo y lệnh cho 1 encounter ----------------
    public ClinicalOrderResponse createOrder(Long encounterId, ClinicalOrderCreateRequest req) {
        Encounter enc = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new RuntimeException("Encounter not found"));

        ClinicalOrder order = new ClinicalOrder();
        order.setEncounter(enc);
        order.setOrderedBy(req.getOrderedBy());
        order.setStatus("ORDERED");
        order.setCreatedAt(LocalDateTime.now());

        ClinicalOrder savedOrder = clinicalOrderRepository.save(order);

        // tạo items
        if (req.getItems() != null) {
            for (ClinicalOrderItemRequest itemReq : req.getItems()) {
                ClinicalOrderItem item = new ClinicalOrderItem();
                item.setClinicalOrder(savedOrder);
                item.setItemType(itemReq.getItemType());
                item.setServiceItemId(itemReq.getServiceItemId());
                item.setLabTestId(itemReq.getLabTestId());
                item.setImagingProcedureId(itemReq.getImagingProcedureId());
                item.setStatus("ORDERED");
                clinicalOrderItemRepository.save(item);
            }
        }

        return mapOrderToResponse(savedOrder);
    }

    // ---------------- Lấy danh sách y lệnh theo encounter ----------------
    public List<ClinicalOrderResponse> getOrdersByEncounter(Long encounterId) {
        return clinicalOrderRepository.findByEncounter_Id(encounterId)
                .stream()
                .map(this::mapOrderToResponse)
                .collect(Collectors.toList());
    }

    // ---------------- Lấy chi tiết 1 y lệnh ----------------
    public ClinicalOrderResponse getOrder(Long orderId) {
        ClinicalOrder order = clinicalOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapOrderToResponse(order);
    }

    // ---------------- Nhập kết quả lab cho 1 item ----------------
        public LabResultResponse addLabResult(Long orderItemId, LabResultCreateRequest req) {
        ClinicalOrderItem item = clinicalOrderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("Order item not found"));

        LabResult result = new LabResult();
        result.setClinicalOrderItem(item);
        result.setParameterName(req.getParameterName());
        result.setResultValue(req.getResultValue());
        result.setUnit(req.getUnit());
        result.setRefLow(req.getRefLow());
        result.setRefHigh(req.getRefHigh());
        result.setAbnormalFlag(req.getAbnormalFlag());
        result.setValidatedBy(req.getValidatedBy());
        result.setValidatedAt(LocalDateTime.now());

        LabResult saved = labResultRepository.save(result);

        // có thể cập nhật status item -> DONE
        item.setStatus("DONE");
        clinicalOrderItemRepository.save(item);

        return mapLabResultToResponse(saved);
    }

    public List<LabResultResponse> getLabResultsByOrderItem(Long orderItemId) {
        return labResultRepository.findByClinicalOrderItem_Id(orderItemId)
                .stream()
                .map(this::mapLabResultToResponse)
                .collect(Collectors.toList());
    }

    // ----------------- Mapping helpers -----------------

    private ClinicalOrderResponse mapOrderToResponse(ClinicalOrder order) {
        ClinicalOrderResponse dto = new ClinicalOrderResponse();
        dto.setId(order.getId());
        dto.setEncounterId(order.getEncounter().getId());
        dto.setOrderedBy(order.getOrderedBy());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());

        List<ClinicalOrderItem> items = clinicalOrderItemRepository.findByClinicalOrder_Id(order.getId());
        List<ClinicalOrderItemResponse> itemDtos = items.stream()
                .map(this::mapOrderItemToResponse)
                .collect(Collectors.toList());

        dto.setItems(itemDtos);
        return dto;
    }

    private ClinicalOrderItemResponse mapOrderItemToResponse(ClinicalOrderItem item) {
        ClinicalOrderItemResponse dto = new ClinicalOrderItemResponse();
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
            imagingProcedureRepository.findById(item.getImagingProcedureId())//Math.toIntExact(item.getImagingProcedureId())
                    .ifPresent(ip -> dto.setImagingProcedureName(ip.getName()));
        }

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

    // ----- Nhập kết quả CĐHA cho 1 order item -----
    public ImagingResultResponse addImagingResult(Long orderItemId, ImagingResultCreateRequest req) {
        ClinicalOrderItem item = clinicalOrderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("Order item not found"));

        List<ImagingResult> existingList = imagingResultRepository.findByClinicalOrderItem_Id(item.getId());
        ImagingResult ir ;
        if(existingList.isEmpty()){
            ir = new ImagingResult();
            ir.setClinicalOrderItem(item);
        }else{
            ir = existingList.get(0);
        }

        ir.setReportText(req.getReportText());
        ir.setImpression(req.getImpression());
        ir.setRadiologistId(req.getRadiologistId());
        ir.setPacsStudyUid(req.getPacsStudyUid());
        ir.setViewerUrl(req.getViewerUrl());

        ImagingResult saved = imagingResultRepository.save(ir);

        // Có thể cập nhật trạng thái item sang DONE (nếu muốn)
        item.setStatus("DONE");
        clinicalOrderItemRepository.save(item);

        return mapImagingResultToResponse(saved);
    }

    public java.util.List<ImagingResultResponse> getImagingResultsByOrderItem(Long orderItemId) {
        return imagingResultRepository.findByClinicalOrderItem_Id(orderItemId)
                .stream()
                .map(this::mapImagingResultToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    // ----- Mapping helper -----
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
