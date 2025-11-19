package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.*;
import com.hospital.hospitalmis.dto.clinical_result.*;
import com.hospital.hospitalmis.service.ClinicalOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ClinicalOrderController {

    private final ClinicalOrderService clinicalOrderService;

    public ClinicalOrderController(ClinicalOrderService clinicalOrderService) {
        this.clinicalOrderService = clinicalOrderService;
    }

    // POST /api/encounters/{id}/orders  : tạo y lệnh mới cho encounter
    @PostMapping("/encounters/{encounterId}/orders")
    public ResponseEntity<ClinicalOrderResponse> createOrder(
            @PathVariable Long encounterId,
            @RequestBody ClinicalOrderCreateRequest request
    ) {
        ClinicalOrderResponse res = clinicalOrderService.createOrder(encounterId, request);
        return ResponseEntity.ok(res);
    }

    // GET /api/encounters/{id}/orders  : danh sách y lệnh của encounter
    @GetMapping("/encounters/{encounterId}/orders")
    public ResponseEntity<List<ClinicalOrderResponse>> getOrdersByEncounter(
            @PathVariable Long encounterId
    ) {
        List<ClinicalOrderResponse> list = clinicalOrderService.getOrdersByEncounter(encounterId);
        return ResponseEntity.ok(list);
    }

    // GET /api/orders/{orderId}
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ClinicalOrderResponse> getOrder(@PathVariable Long orderId) {
        ClinicalOrderResponse res = clinicalOrderService.getOrder(orderId);
        return ResponseEntity.ok(res);
    }

    // POST /api/orders/items/{itemId}/lab-results  : labo nhập kết quả
    @PostMapping("/orders/items/{itemId}/lab-results")
    public ResponseEntity<LabResultResponse> addLabResult(
            @PathVariable Long itemId,
            @RequestBody LabResultCreateRequest request
    ) {
        LabResultResponse res = clinicalOrderService.addLabResult(itemId, request);
        return ResponseEntity.ok(res);
    }

    // GET /api/orders/items/{itemId}/lab-results
    @GetMapping("/orders/items/{itemId}/lab-results")
    public ResponseEntity<List<LabResultResponse>> getLabResults(
            @PathVariable Long itemId
    ) {
        List<LabResultResponse> list = clinicalOrderService.getLabResultsByOrderItem(itemId);
        return ResponseEntity.ok(list);
    }
    // POST /api/orders/items/{itemId}/imaging-results  : CĐHA nhập kết quả
    @PostMapping("/orders/items/{itemId}/imaging-results")
    public ResponseEntity<ImagingResultResponse> addImagingResult(
            @PathVariable Long itemId,
            @RequestBody ImagingResultCreateRequest request
    ) {
        ImagingResultResponse res = clinicalOrderService.addImagingResult(itemId, request);
        return ResponseEntity.ok(res);
    }

    // GET /api/orders/items/{itemId}/imaging-results
    @GetMapping("/orders/items/{itemId}/imaging-results")
    public ResponseEntity<java.util.List<ImagingResultResponse>> getImagingResults(
            @PathVariable Long itemId
    ) {
        java.util.List<ImagingResultResponse> list = clinicalOrderService.getImagingResultsByOrderItem(itemId);
        return ResponseEntity.ok(list);
    }

}
