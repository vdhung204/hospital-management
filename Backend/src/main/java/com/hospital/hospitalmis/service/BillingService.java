package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.*;
import com.hospital.hospitalmis.dto.invoice.*;
import com.hospital.hospitalmis.entity.*;
import com.hospital.hospitalmis.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BillingService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceLineRepository invoiceLineRepository;
    private final PaymentRepository paymentRepository;
    private final PatientRepository patientRepository;
    private final EncounterRepository encounterRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final TariffRepository tariffRepository;
    private final ClinicalOrderItemRepository clinicalOrderItemRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    private final DrugRepository drugRepository;
    private final InsuranceCardRepository insuranceCardRepository;

    public BillingService(InvoiceRepository invoiceRepository,
                          InvoiceLineRepository invoiceLineRepository,
                          PaymentRepository paymentRepository,
                          PatientRepository patientRepository,
                          EncounterRepository encounterRepository,
                          ServiceItemRepository serviceItemRepository,
                          TariffRepository tariffRepository,
                          ClinicalOrderItemRepository clinicalOrderItemRepository,
                          PrescriptionRepository prescriptionRepository,
                          PrescriptionItemRepository prescriptionItemRepository,
                          DrugRepository drugRepository,
                          InsuranceCardRepository insuranceCardRepository) {
        this.invoiceRepository = invoiceRepository;
        this.invoiceLineRepository = invoiceLineRepository;
        this.paymentRepository = paymentRepository;
        this.patientRepository = patientRepository;
        this.encounterRepository = encounterRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.tariffRepository = tariffRepository;
        this.clinicalOrderItemRepository = clinicalOrderItemRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionItemRepository = prescriptionItemRepository;
        this.drugRepository = drugRepository;
        this.insuranceCardRepository = insuranceCardRepository;
    }

    // --------- Tạo hóa đơn mới ---------
//    public InvoiceDetailResponse createInvoice(InvoiceCreateRequest req) {
//        Patient patient = patientRepository.findById(req.getPatientId())
//                .orElseThrow(() -> new RuntimeException("Patient not found"));
//
//        Encounter encounter = null;
//        if (req.getEncounterId() != null) {
//            encounter = encounterRepository.findById(req.getEncounterId())
//                    .orElseThrow(() -> new RuntimeException("Encounter not found"));
//        }
//
//        Invoice invoice = new Invoice();
//        invoice.setPatient(patient);
//        invoice.setEncounter(encounter);
//        invoice.setCreatedAt(LocalDateTime.now());
//        invoice.setStatus("DRAFT");
//
//        invoice.setTotalAmount(BigDecimal.ZERO);
//        invoice.setDiscount(req.getDiscount() != null ? req.getDiscount() : BigDecimal.ZERO);
//        invoice.setNetAmount(BigDecimal.ZERO);
//        invoice.setTotalInsuranceAmount(BigDecimal.ZERO); // NEW
//        invoice.setTotalPatientAmount(BigDecimal.ZERO);   // NEW
//
//        Invoice savedInvoice = invoiceRepository.save(invoice);
//
//        String payerType = (req.getPayerType() != null && !req.getPayerType().isBlank())
//                ? req.getPayerType()
//                : "CASH";
//
//        boolean isInsurance = "INSURANCE".equalsIgnoreCase(payerType)
//                && req.getInsuranceCardId() != null;
//
//        InsuranceCard insuranceCard = null;
//        BigDecimal coverageRate = BigDecimal.ZERO;
//
//        if (isInsurance) {
//            insuranceCard = insuranceCardRepository.findById(req.getInsuranceCardId())
//                    .orElseThrow(() -> new RuntimeException("Insurance card not found"));
//
//            //coverageRate = insuranceCard.getCoverageRate();
//            // Nếu DB lưu 80.00 = 80% thì dùng:
//            coverageRate = insuranceCard.getCoverageRate().divide(BigDecimal.valueOf(100));
//        }
//
//        BigDecimal total = BigDecimal.ZERO;
//        BigDecimal totalInsurance = BigDecimal.ZERO;
//        BigDecimal totalPatient = BigDecimal.ZERO;
//
//        if (req.getLines() != null) {
//            for (InvoiceLineRequest lineReq : req.getLines()) {
//                ServiceItem serviceItem = serviceItemRepository.findById(lineReq.getServiceItemId())
//                        .orElseThrow(() -> new RuntimeException("Service item not found"));
//
//                BigDecimal qty = BigDecimal.valueOf(lineReq.getQuantity());
//                BigDecimal unitPrice = findPriceFromTariff(serviceItem.getId(), payerType);
//                BigDecimal lineAmount = unitPrice.multiply(qty);
//
//                BigDecimal insuranceAmount = BigDecimal.ZERO;
//                BigDecimal patientAmount = lineAmount;
//
//                if (isInsurance) {
//                    insuranceAmount = lineAmount
//                            .multiply(coverageRate)
//                            .setScale(2, RoundingMode.HALF_UP);
//                    patientAmount = lineAmount.subtract(insuranceAmount);
//                }
//
//                InvoiceLine line = new InvoiceLine();
//                line.setInvoice(savedInvoice);
//                line.setServiceItem(serviceItem);
//                line.setQuantity(lineReq.getQuantity());
//                line.setUnitPrice(unitPrice);
//                line.setLineAmount(lineAmount);
//                line.setSourceType(lineReq.getSourceType());
//                line.setSourceId(lineReq.getSourceId());
//
//                // NEW
//                line.setInsuranceAmount(insuranceAmount);
//                line.setPatientAmount(patientAmount);
//                line.setAppliedCoverageRate(isInsurance ? coverageRate : null);
//                line.setInsuranceCard(isInsurance ? insuranceCard : null);
//
//                invoiceLineRepository.save(line);
//
//                total = total.add(lineAmount);
//                totalInsurance = totalInsurance.add(insuranceAmount);
//                totalPatient = totalPatient.add(patientAmount);
//            }
//        }
//
//        savedInvoice.setTotalAmount(total);
//        savedInvoice.setTotalInsuranceAmount(totalInsurance);
//        savedInvoice.setTotalPatientAmount(totalPatient);
//
//        BigDecimal discount = savedInvoice.getDiscount() != null
//                ? savedInvoice.getDiscount()
//                : BigDecimal.ZERO;
//
//        // GIỮ LOGIC CŨ: net = total - discount (để không ảnh hưởng chỗ khác)
//        savedInvoice.setNetAmount(total.subtract(discount));
//
//        invoiceRepository.save(savedInvoice);
//
//        return getInvoiceDetail(savedInvoice.getId());
//    }
    public InvoiceDetailResponse createInvoice(InvoiceCreateRequest req) {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Encounter encounter = null;
        if (req.getEncounterId() != null) {
            encounter = encounterRepository.findById(req.getEncounterId())
                    .orElseThrow(() -> new RuntimeException("Encounter not found"));
        }

        Invoice invoice = new Invoice();
        invoice.setPatient(patient);
        invoice.setEncounter(encounter);
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setStatus("DRAFT");

        invoice.setTotalAmount(BigDecimal.ZERO);
        invoice.setDiscount(req.getDiscount() != null ? req.getDiscount() : BigDecimal.ZERO);
        invoice.setNetAmount(BigDecimal.ZERO);
        invoice.setTotalInsuranceAmount(BigDecimal.ZERO); // cần field này trong entity
        invoice.setTotalPatientAmount(BigDecimal.ZERO);   // cần field này trong entity

        Invoice savedInvoice = invoiceRepository.save(invoice);

        String payerType = (req.getPayerType() != null && !req.getPayerType().isBlank())
                ? req.getPayerType()
                : "CASH";

        boolean isInsurance = "INSURANCE".equalsIgnoreCase(payerType);

        InsuranceCard insuranceCard = null;
        BigDecimal coverageRate = BigDecimal.ZERO;

        if (isInsurance) {
            insuranceCard = findActiveInsuranceCardForPatient(patient);
            if (insuranceCard == null) {
                // Tuỳ anh: hoặc ném lỗi, hoặc fallback sang CASH
                throw new RuntimeException("No active insurance card for patient " + patient.getPatientCode());
            }

//            coverageRate = insuranceCard.getCoverageRate();
//            // Nếu anh đang lưu 80.00 = 80% thì:
            coverageRate = insuranceCard.getCoverageRate().divide(BigDecimal.valueOf(100));
        }

        BigDecimal total = BigDecimal.ZERO;
        BigDecimal totalInsurance = BigDecimal.ZERO;
        BigDecimal totalPatient = BigDecimal.ZERO;

        if (req.getLines() != null) {
            for (InvoiceLineRequest lineReq : req.getLines()) {
                ServiceItem serviceItem = serviceItemRepository.findById(lineReq.getServiceItemId())
                        .orElseThrow(() -> new RuntimeException("Service item not found"));

                BigDecimal qty = BigDecimal.valueOf(lineReq.getQuantity());
                BigDecimal unitPrice = findPriceFromTariff(serviceItem.getId(), payerType);
                BigDecimal lineAmount = unitPrice.multiply(qty);

                BigDecimal insuranceAmount = BigDecimal.ZERO;
                BigDecimal patientAmount = lineAmount;

                if (isInsurance) {
                    insuranceAmount = lineAmount.multiply(coverageRate)
                            .setScale(2, RoundingMode.HALF_UP);
                    patientAmount = lineAmount.subtract(insuranceAmount);
                }

                InvoiceLine line = new InvoiceLine();
                line.setInvoice(savedInvoice);
                line.setServiceItem(serviceItem);
                line.setQuantity(lineReq.getQuantity());
                line.setUnitPrice(unitPrice);
                line.setLineAmount(lineAmount);
                line.setSourceType(lineReq.getSourceType());
                line.setSourceId(lineReq.getSourceId());

                // các field mới trong entity InvoiceLine
                line.setInsuranceAmount(insuranceAmount);
                line.setPatientAmount(patientAmount);
                line.setAppliedCoverageRate(isInsurance ? coverageRate : null);
                line.setInsuranceCard(isInsurance ? insuranceCard : null);

                invoiceLineRepository.save(line);

                total = total.add(lineAmount);
                totalInsurance = totalInsurance.add(insuranceAmount);
                totalPatient = totalPatient.add(patientAmount);
            }
        }

        savedInvoice.setTotalAmount(total);
        savedInvoice.setTotalInsuranceAmount(totalInsurance);
        savedInvoice.setTotalPatientAmount(totalPatient);

        BigDecimal discount = savedInvoice.getDiscount() != null
                ? savedInvoice.getDiscount()
                : BigDecimal.ZERO;

        // Giữ nghiệp vụ cũ: netAmount = total - discount
        savedInvoice.setNetAmount(total.subtract(discount));

        invoiceRepository.save(savedInvoice);

        return getInvoiceDetail(savedInvoice.getId());
    }


    public InvoiceDetailResponse createAutoInvoiceForEncounter(Long encounterId, AutoInvoiceRequest req) {

        // 1. Lấy encounter & patient
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new RuntimeException("Encounter not found"));

        if (encounter.getPatient() == null) {
            throw new RuntimeException("Encounter has no patient");
        }
        Long patientId = encounter.getPatient().getId();

        // 2. Đọc option
        String payerType = (req.getPayerType() != null && !req.getPayerType().isBlank())
                ? req.getPayerType()
                : "CASH";

        boolean includeConsult = req.getIncludeConsult() == null ? true : req.getIncludeConsult();
        boolean includeLabs    = req.getIncludeLabs()    == null ? true : req.getIncludeLabs();
        boolean includeImaging = req.getIncludeImaging() == null ? true : req.getIncludeImaging();
        boolean includeDrugs   = req.getIncludeDrugs()   == null ? true : req.getIncludeDrugs();

        java.util.List<InvoiceLineRequest> autoLines = new java.util.ArrayList<>();

        // 3. Khám ngoại trú (CONSULT)
        if (includeConsult) {
            java.util.List<ServiceItem> consultItems =
                    serviceItemRepository.findByServiceType("CONSULT");

            if (!consultItems.isEmpty()) {
                ServiceItem consultItem = consultItems.get(0);

                boolean billed = invoiceLineRepository
                        .existsBySourceTypeAndSourceId("CONSULT", encounterId);

                if (!billed) {
                    InvoiceLineRequest lineReq = new InvoiceLineRequest();
                    lineReq.setServiceItemId(consultItem.getId());
                    lineReq.setQuantity(1);
                    lineReq.setSourceType("CONSULT");
                    lineReq.setSourceId(encounterId);
                    autoLines.add(lineReq);
                }
            }
        }

        // 4. Xét nghiệm & CĐHA từ clinical_order_item
        if (includeLabs || includeImaging) {
            java.util.List<ClinicalOrderItem> items =
                    clinicalOrderItemRepository.findByClinicalOrder_Encounter_Id(encounterId);

            for (ClinicalOrderItem item : items) {
                String type = item.getItemType(); // LAB_TEST / IMG_PROC

                if ("LAB_TEST".equalsIgnoreCase(type) && includeLabs) {
                    boolean billed = invoiceLineRepository
                            .existsBySourceTypeAndSourceId("LAB", item.getId());
                    if (!billed) {
                        InvoiceLineRequest lineReq = new InvoiceLineRequest();
                        lineReq.setServiceItemId(item.getServiceItemId());
                        lineReq.setQuantity(1);
                        lineReq.setSourceType("LAB");
                        lineReq.setSourceId(item.getId());
                        autoLines.add(lineReq);
                    }
                }

                if ("IMG_PROC".equalsIgnoreCase(type) && includeImaging) {
                    boolean billed = invoiceLineRepository
                            .existsBySourceTypeAndSourceId("IMG", item.getId());
                    if (!billed) {
                        InvoiceLineRequest lineReq = new InvoiceLineRequest();
                        lineReq.setServiceItemId(item.getServiceItemId());
                        lineReq.setQuantity(1);
                        lineReq.setSourceType("IMG");
                        lineReq.setSourceId(item.getId());
                        autoLines.add(lineReq);
                    }
                }
            }
        }

        // 5. Thuốc từ prescription_item
        if (includeDrugs) {
            java.util.List<Prescription> prescriptions =
                    prescriptionRepository.findByEncounter_Id(encounterId);

            for (Prescription pr : prescriptions) {
                java.util.List<PrescriptionItem> pis =
                        prescriptionItemRepository.findByPrescription_Id(pr.getId());

                for (PrescriptionItem pi : pis) {
                    boolean billed = invoiceLineRepository
                            .existsBySourceTypeAndSourceId("DRUG", pi.getId());
                    if (billed) continue;

                    Drug drug = drugRepository.findById(pi.getDrug().getId())
                            .orElseThrow(() -> new RuntimeException("Drug not found id=" + pi.getDrug().getId()));

                    InvoiceLineRequest lineReq = new InvoiceLineRequest();
                    lineReq.setServiceItemId(drug.getServiceItem().getId());
                    lineReq.setQuantity(pi.getQuantity());
                    lineReq.setSourceType("DRUG");
                    lineReq.setSourceId(pi.getId());
                    autoLines.add(lineReq);
                }
            }
        }

        // 6. Không có dịch vụ mới -> báo lỗi
        if (autoLines.isEmpty()) {
            throw new RuntimeException("No unbilled services found for encounter " + encounterId);
        }

        // 7. Gọi createInvoice để tính tiền + dùng tariff
        InvoiceCreateRequest createReq = new InvoiceCreateRequest();
        createReq.setPatientId(patientId);
        createReq.setEncounterId(encounterId);
        createReq.setPayerType(payerType);
        createReq.setDiscount(java.math.BigDecimal.ZERO);
        createReq.setLines(autoLines);
        createReq.setInsuranceCardId(req.getInsuranceCardId());

        return createInvoice(createReq);
    }


    // --------- Lấy chi tiết 1 hóa đơn ---------
    public InvoiceDetailResponse getInvoiceDetail(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        InvoiceDetailResponse dto = new InvoiceDetailResponse();
        dto.setId(invoice.getId());
        dto.setPatientId(invoice.getPatient().getId());
        dto.setPatientCode(invoice.getPatient().getPatientCode());
        dto.setPatientName(invoice.getPatient().getFullName());

        dto.setEncounterId(invoice.getEncounter() != null ? invoice.getEncounter().getId() : null);
        dto.setTotalAmount(invoice.getTotalAmount());
        dto.setDiscount(invoice.getDiscount());
        dto.setNetAmount(invoice.getNetAmount());
        dto.setStatus(invoice.getStatus());
        dto.setCreatedAt(invoice.getCreatedAt());
        dto.setTotalInsuranceAmount(invoice.getTotalInsuranceAmount());
        dto.setTotalPatientAmount(invoice.getTotalPatientAmount());

        // Lines
        List<InvoiceLine> lines = invoiceLineRepository.findByInvoice_Id(invoice.getId());
        List<InvoiceLineResponse> lineDtos = lines.stream()
                .map(this::mapInvoiceLineToResponse)
                .collect(Collectors.toList());
        dto.setLines(lineDtos);

        // Payments
        List<Payment> payments = paymentRepository.findByInvoice_Id(invoice.getId());
        List<PaymentResponse> paymentDtos = payments.stream()
                .map(this::mapPaymentToResponse)
                .collect(Collectors.toList());
        dto.setPayments(paymentDtos);

        return dto;
    }

    // --------- Danh sách hóa đơn theo encounter ---------
    public List<InvoiceDetailResponse> getInvoicesByEncounter(Long encounterId) {
        return invoiceRepository.findByEncounter_Id(encounterId).stream()
                .map(i -> getInvoiceDetail(i.getId()))
                .collect(Collectors.toList());
    }

    // --------- Thêm thanh toán ---------
    public InvoiceDetailResponse addPayment(Long invoiceId, PaymentCreateRequest req) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        Payment p = new Payment();
        p.setInvoice(invoice);
        p.setAmount(req.getAmount());
        p.setMethod(req.getMethod());
        p.setRefNumber(req.getRefNumber());
        p.setPaidAt(LocalDateTime.now());

        paymentRepository.save(p);

        // Tính tổng tiền đã thanh toán
        List<Payment> payments = paymentRepository.findByInvoice_Id(invoiceId);
        BigDecimal paidTotal = payments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Cập nhật trạng thái hóa đơn
        int cmp = paidTotal.compareTo(invoice.getNetAmount());
        if (cmp >= 0) {
            invoice.setStatus("PAID");
        } else if (paidTotal.compareTo(BigDecimal.ZERO) > 0) {
            invoice.setStatus("PARTIAL");
        } else {
            invoice.setStatus("DRAFT");
        }

        invoiceRepository.save(invoice);

        return getInvoiceDetail(invoiceId);
    }

    // --------- Mapping helpers ---------
    private InvoiceLineResponse mapInvoiceLineToResponse(InvoiceLine line) {
        InvoiceLineResponse dto = new InvoiceLineResponse();
        dto.setId(line.getId());
        dto.setServiceItemId(line.getServiceItem().getId());
        dto.setServiceItemName(line.getServiceItem().getName());
        dto.setQuantity(line.getQuantity());
        dto.setUnitPrice(line.getUnitPrice());
        dto.setLineAmount(line.getLineAmount());
        dto.setSourceType(line.getSourceType());
        dto.setSourceId(line.getSourceId());
        dto.setInsuranceAmount(line.getInsuranceAmount());
        dto.setPatientAmount(line.getPatientAmount());
        dto.setAppliedCoverageRate(line.getAppliedCoverageRate());
        dto.setInsuranceCardId(
                line.getInsuranceCard() != null ? line.getInsuranceCard().getId() : null
        );
        return dto;
    }

    private PaymentResponse mapPaymentToResponse(Payment p) {
        PaymentResponse dto = new PaymentResponse();
        dto.setId(p.getId());
        dto.setAmount(p.getAmount());
        dto.setMethod(p.getMethod());
        dto.setPaidAt(p.getPaidAt());
        dto.setRefNumber(p.getRefNumber());
        return dto;
    }
    // get price effetive
    private BigDecimal findPriceFromTariff(Long serviceItemId, String payerType) {
        LocalDate today = LocalDate.now();

        List<Tariff> tariffs = tariffRepository.findActiveTariffs(serviceItemId, payerType, today);
        if (tariffs.isEmpty()) {
            throw new RuntimeException("No active tariff for serviceItemId=" + serviceItemId
                    + " payerType=" + payerType);
        }

        // đơn giản lấy tariff đầu tiên
        return tariffs.get(0).getPrice();
    }
    private InsuranceCard findActiveInsuranceCardForPatient(Patient patient) {
        List<InsuranceCard> cards = insuranceCardRepository.findByPatient_Id(patient.getId());
        if (cards == null || cards.isEmpty()) {
            return null;
        }

        LocalDate today = LocalDate.now();

        // Ưu tiên thẻ primary & còn hạn
        return cards.stream()
                .filter(c ->
                        (c.getValidFrom() == null || !c.getValidFrom().isAfter(today)) &&
                                (c.getValidTo() == null || !c.getValidTo().isBefore(today)))
                .sorted((c1, c2) -> {
                    // primary trước, sau đó ưu tiên valid_to muộn hơn
                    int p1 = Boolean.TRUE.equals(c1.getPrimary()) ? 0 : 1;
                    int p2 = Boolean.TRUE.equals(c2.getPrimary()) ? 0 : 1;
                    int cmp = Integer.compare(p1, p2);
                    if (cmp != 0) return cmp;
                    LocalDate v1 = c1.getValidTo();
                    LocalDate v2 = c2.getValidTo();
                    if (v1 == null && v2 == null) return 0;
                    if (v1 == null) return 1;
                    if (v2 == null) return -1;
                    return v2.compareTo(v1); // valid_to xa hơn lên trước
                })
                .findFirst()
                .orElse(null);
    }
    public BillingPreviewResponse getBillingPreview(Long encounterId) {

        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new RuntimeException("Encounter not found"));

        if (encounter.getPatient() == null) {
            throw new RuntimeException("Encounter has no patient");
        }

        BillingPreviewResponse res = new BillingPreviewResponse();
        res.setEncounterId(encounter.getId());
        res.setPatientId(encounter.getPatient().getId());
        res.setPatientCode(encounter.getPatient().getPatientCode());
        res.setPatientName(encounter.getPatient().getFullName());

        java.util.List<ServiceUsageItem> all = new java.util.ArrayList<>();

        // ===== 1. DV khám (CONSULT) =====
        java.util.List<ServiceItem> consultItems =
                serviceItemRepository.findByServiceType("CONSULT");

        if (!consultItems.isEmpty()) {
            ServiceItem consultItem = consultItems.get(0);

            java.util.List<InvoiceLine> lines =
                    invoiceLineRepository.findBySourceTypeAndSourceId("CONSULT", encounterId);

            ServiceUsageItem item = new ServiceUsageItem();
            item.setGroup("CONSULT");
            item.setSourceType("CONSULT");
            item.setSourceId(encounterId);

            item.setServiceItemId(consultItem.getId());
            item.setServiceItemCode(consultItem.getCode());
            item.setServiceItemName(consultItem.getName());

            item.setDescription(consultItem.getName());
            item.setQuantity(1);

            boolean billed = !lines.isEmpty();
            item.setBilled(billed);
            item.setInvoiceId(billed ? lines.get(0).getInvoice().getId() : null);

            all.add(item);
        }

        // ===== 2. XN + CĐHA từ clinical_order_item =====
        java.util.List<ClinicalOrderItem> orderItems =
                clinicalOrderItemRepository.findByClinicalOrder_Encounter_Id(encounterId);

        for (ClinicalOrderItem coi : orderItems) {
            String type = coi.getItemType(); // "LAB_TEST" hoặc "IMG_PROC"

            String group;
            String sourceType;
            if ("LAB_TEST".equalsIgnoreCase(type)) {
                group = "LAB";
                sourceType = "LAB";
            } else if ("IMG_PROC".equalsIgnoreCase(type)) {
                group = "IMG";
                sourceType = "IMG";
            } else {
                // loại khác thì bỏ qua trong preview billing
                continue;
            }

            ServiceUsageItem item = new ServiceUsageItem();
            item.setGroup(group);
            item.setSourceType(sourceType);
            item.setSourceId(coi.getId());

            // lấy thông tin service item
            if (coi.getServiceItemId() != null) {
                ServiceItem si = serviceItemRepository.findById(coi.getServiceItemId())
                        .orElse(null);
                if (si != null) {
                    item.setServiceItemId(si.getId());
                    item.setServiceItemCode(si.getCode());
                    item.setServiceItemName(si.getName());
                    item.setDescription(si.getName());
                } else {
                    item.setDescription(group + " item #" + coi.getId());
                }
            } else {
                item.setDescription(group + " item #" + coi.getId());
            }

            item.setQuantity(1); // 1 y lệnh = 1 lần thực hiện

            // kiểm tra đã billing chưa
            java.util.List<InvoiceLine> lines =
                    invoiceLineRepository.findBySourceTypeAndSourceId(sourceType, coi.getId());

            boolean billed = !lines.isEmpty();
            item.setBilled(billed);
            item.setInvoiceId(billed ? lines.get(0).getInvoice().getId() : null);

            all.add(item);
        }

        // ===== 3. Thuốc từ prescription_item =====
        java.util.List<Prescription> prescs =
                prescriptionRepository.findByEncounter_Id(encounterId);

        for (Prescription pr : prescs) {
            java.util.List<PrescriptionItem> pis =
                    prescriptionItemRepository.findByPrescription_Id(pr.getId());

            for (PrescriptionItem pi : pis) {
                ServiceUsageItem item = new ServiceUsageItem();
                item.setGroup("DRUG");
                item.setSourceType("DRUG");
                item.setSourceId(pi.getId());

                // lấy thông tin thuốc + service_item
                Drug drug = drugRepository.findById(pi.getDrug().getId()).orElse(null);
                if (drug != null) {
                    item.setDescription(drug.getName());
                    if (drug.getServiceItem() != null) {
                        ServiceItem si = serviceItemRepository.findById(drug.getServiceItem().getId())
                                .orElse(null);
                        if (si != null) {
                            item.setServiceItemId(si.getId());
                            item.setServiceItemCode(si.getCode());
                            item.setServiceItemName(si.getName());
                        }
                    }
                } else {
                    item.setDescription("Drug item #" + pi.getId());
                }

                item.setQuantity(pi.getQuantity());

                java.util.List<InvoiceLine> lines =
                        invoiceLineRepository.findBySourceTypeAndSourceId("DRUG", pi.getId());

                boolean billed = !lines.isEmpty();
                item.setBilled(billed);
                item.setInvoiceId(billed ? lines.get(0).getInvoice().getId() : null);

                all.add(item);
            }
        }

        res.setServices(all);
        return res;
    }
}
