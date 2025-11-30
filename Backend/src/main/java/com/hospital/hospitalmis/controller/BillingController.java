package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.*;
import com.hospital.hospitalmis.dto.invoice.*;
import com.hospital.hospitalmis.service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    // POST /api/invoices  -> tạo hóa đơn mới
    @PostMapping("/invoices")
    public ResponseEntity<InvoiceDetailResponse> createInvoice(
            @RequestBody InvoiceCreateRequest request
    ) {
        InvoiceDetailResponse dto = billingService.createInvoice(request);
        return ResponseEntity.ok(dto);
    }

    // GET /api/invoices/{id} -> xem chi tiết hóa đơn
    @GetMapping("/invoices/{id}")
    public ResponseEntity<InvoiceDetailResponse> getInvoice(@PathVariable Long id) {
        InvoiceDetailResponse dto = billingService.getInvoiceDetail(id);
        return ResponseEntity.ok(dto);
    }

    // GET /api/encounters/{encounterId}/invoices -> danh sách hóa đơn của 1 encounter
    @GetMapping("/encounters/{encounterId}/invoices")
    public ResponseEntity<List<InvoiceDetailResponse>> getInvoicesByEncounter(
            @PathVariable Long encounterId
    ) {
        List<InvoiceDetailResponse> list = billingService.getInvoicesByEncounter(encounterId);
        return ResponseEntity.ok(list);
    }

    // POST /api/invoices/{id}/payments -> thêm thanh toán
    @PostMapping("/invoices/{id}/payments")
    public ResponseEntity<InvoiceDetailResponse> addPayment(
            @PathVariable Long id,
            @RequestBody PaymentCreateRequest request
    ) {
        InvoiceDetailResponse dto = billingService.addPayment(id, request);
        return ResponseEntity.ok(dto);
    }
    @PostMapping("/encounters/{encounterId}/invoices/auto")
    public ResponseEntity<InvoiceDetailResponse> createAutoInvoiceForEncounter(
            @PathVariable Long encounterId,
            @RequestBody AutoInvoiceRequest request
    ) {
        InvoiceDetailResponse dto =
                billingService.createAutoInvoiceForEncounter(encounterId, request);
        return ResponseEntity.ok(dto);
    }

    // NEW: preview tất cả dịch vụ của 1 encounter
    @GetMapping("/encounters/{encounterId}/billing-preview")
    public ResponseEntity<BillingPreviewResponse> getBillingPreview(
            @PathVariable Long encounterId
    ) {
        BillingPreviewResponse res = billingService.getBillingPreview(encounterId);
        return ResponseEntity.ok(res);
    }
}
