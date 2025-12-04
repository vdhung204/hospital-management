package com.hospital.hospitalmis.service.impl;

import com.hospital.hospitalmis.dto.pharmacy.DispenseCreateRequest;
import com.hospital.hospitalmis.dto.pharmacy.DispenseDetailDto;
import com.hospital.hospitalmis.dto.pharmacy.DispenseItemCreateRequest;
import com.hospital.hospitalmis.dto.pharmacy.DispenseItemDto;
import com.hospital.hospitalmis.entity.*;
import com.hospital.hospitalmis.repository.*;
import com.hospital.hospitalmis.service.DispenseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class DispenseServiceImpl implements DispenseService {

    private final DispenseRepository dispenseRepository;
    private final DispenseItemRepository dispenseItemRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final StaffRepository staffRepository;
    private final DrugBatchRepository drugBatchRepository;

    public DispenseServiceImpl(
            DispenseRepository dispenseRepository,
            DispenseItemRepository dispenseItemRepository,
            StockTransactionRepository stockTransactionRepository,
            PrescriptionRepository prescriptionRepository,
            StaffRepository staffRepository,
            DrugBatchRepository drugBatchRepository
    ) {
        this.dispenseRepository = dispenseRepository;
        this.dispenseItemRepository = dispenseItemRepository;
        this.stockTransactionRepository = stockTransactionRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.staffRepository = staffRepository;
        this.drugBatchRepository = drugBatchRepository;
    }

    private DispenseItemDto toItemDto(DispenseItem di) {
        DispenseItemDto dto = new DispenseItemDto();
        dto.setId(di.getId());
        dto.setQuantity(di.getQuantity());

        DrugBatch batch = di.getDrugBatch();
        if (batch != null) {
            dto.setBatchId(batch.getId());
            dto.setBatchNumber(batch.getBatchNumber());
            dto.setExpiryDate(batch.getExpiryDate());

            Drug drug = batch.getDrug();
            if (drug != null) {
                dto.setDrugId(drug.getId());
                dto.setDrugCode(drug.getCode());
                dto.setDrugName(drug.getName());
            }
        }

        return dto;
    }

    private DispenseDetailDto toDetailDto(Dispense d, List<DispenseItem> items) {
        DispenseDetailDto dto = new DispenseDetailDto();
        dto.setId(d.getId());
        dto.setDispensedAt(d.getDispensedAt());
        dto.setStatus(d.getStatus());

        if (d.getPrescription() != null) {
            dto.setPrescriptionId(d.getPrescription().getId());
            if(d.getPrescription().getEncounter() != null
            && d.getPrescription().getEncounter().getPatient() != null) {
                dto.setPatientCode(d.getPrescription().getEncounter().getPatient().getPatientCode());
                dto.setPatientName(d.getPrescription().getEncounter().getPatient().getFullName());
            }
        }

        if (d.getPharmacist() != null) {
            dto.setPharmacistId(d.getPharmacist().getId());
            dto.setPharmacistName(d.getPharmacist().getFullName()); // tuỳ field trong Staff
        }

        dto.setItems(items.stream().map(this::toItemDto).toList());
        return dto;
    }

    @Override
    public DispenseDetailDto createDispense(DispenseCreateRequest request) {

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Dispense must have at least one item");
        }

        Prescription prescription = prescriptionRepository.findById(request.getPrescriptionId())
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        Staff pharmacist = null;
        if (request.getPharmacistId() != null) {
            pharmacist = staffRepository.findById(request.getPharmacistId())
                    .orElseThrow(() -> new RuntimeException("Pharmacist (staff) not found"));
        }

        // 1. Tạo phiếu Dispense
        Dispense dispense = new Dispense();
        dispense.setPrescription(prescription);
        dispense.setPharmacist(pharmacist);
        dispense.setDispensedAt(LocalDateTime.now());
        dispense.setStatus("COMPLETED"); // hoặc PENDING tuỳ anh

        Dispense savedDispense = dispenseRepository.save(dispense);

        // 2. Với từng item: kiểm tra tồn kho, trừ kho, tạo DispenseItem + StockTransaction
        for (DispenseItemCreateRequest itemReq : request.getItems()) {

            DrugBatch batch = drugBatchRepository.findById(itemReq.getDrugBatchId())
                    .orElseThrow(() -> new RuntimeException("DrugBatch not found: " + itemReq.getDrugBatchId()));

            int qty = itemReq.getQuantity() != null ? itemReq.getQuantity() : 0;
            if (qty <= 0) {
                throw new RuntimeException("Quantity must be > 0 for batch " + batch.getId());
            }

            int onHand = batch.getQuantityOnHand();
            if (onHand < qty) {
                throw new RuntimeException("Not enough stock for batch " + batch.getBatchNumber()
                        + ". On hand: " + onHand + ", requested: " + qty);
            }

            // Trừ kho trong DrugBatch
            batch.setQuantityOnHand(onHand - qty);
            drugBatchRepository.save(batch);

            // Tạo dòng DispenseItem
            DispenseItem di = new DispenseItem();
            di.setDispense(savedDispense);
            di.setDrugBatch(batch);
            di.setQuantity(qty);
            dispenseItemRepository.save(di);

            // Ghi StockTransaction OUT (quantity âm theo mô tả DB)
            StockTransaction tx = new StockTransaction();
            tx.setDrugBatch(batch);
            tx.setTxnType("OUT");
            tx.setQuantity(-qty); // OUT = số âm
            tx.setTxnTime(LocalDateTime.now());
            tx.setReferenceType("DISPENSE");
            tx.setReferenceId(savedDispense.getId());

            stockTransactionRepository.save(tx);
        }
        // Cập nhật đơn thuốc
        prescription.setStatus("DONE");
        prescriptionRepository.save(prescription);
        // 3. Load lại items để map DTO
        List<DispenseItem> items = dispenseItemRepository
                .findAll() // có thể tối ưu bằng custom query theo dispense_id
                .stream()
                .filter(di -> di.getDispense().getId().equals(savedDispense.getId()))
                .toList();

        return toDetailDto(savedDispense, items);
    }

    @Override
    @Transactional(readOnly = true)
    public DispenseDetailDto getById(Long id) {
        Dispense d = dispenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispense not found"));
        // lazy load items
        List<DispenseItem> items = d.getId() == null
                ? List.of()
                : dispenseItemRepository.findAll().stream()
                .filter(di -> di.getDispense().getId().equals(d.getId()))
                .toList();
        return toDetailDto(d, items);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DispenseDetailDto> getByPrescription(Long prescriptionId) {
        List<Dispense> list = dispenseRepository.findByPrescriptionId(prescriptionId);
        return list.stream()
                .map(d -> {
                    List<DispenseItem> items = dispenseItemRepository.findAll().stream()
                            .filter(di -> di.getDispense().getId().equals(d.getId()))
                            .toList();
                    return toDetailDto(d, items);
                })
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public List<DispenseDetailDto> getAll() {
        return dispenseRepository.findAllByOrderByDispensedAtDesc().stream()
                .map(d -> {
                    // Lazy load items cho từng phiếu (hoặc bỏ qua items nếu chỉ cần hiện list tóm tắt)
                    List<DispenseItem> items = dispenseItemRepository.findAll().stream()
                            .filter(di -> di.getDispense().getId().equals(d.getId()))
                            .toList();
                    return toDetailDto(d, items);
                })
                .toList();
    }
}
