package com.hospital.hospitalmis.service.impl;

import com.hospital.hospitalmis.dto.master.DrugBatchDto;
import com.hospital.hospitalmis.dto.master.DrugBatchRequest;
import com.hospital.hospitalmis.dto.prescribe.DrugBatchAllocationItemDto;
import com.hospital.hospitalmis.dto.prescribe.DrugBatchAllocationResultDto;
import com.hospital.hospitalmis.entity.Drug;
import com.hospital.hospitalmis.entity.DrugBatch;
import com.hospital.hospitalmis.repository.DrugBatchRepository;
import com.hospital.hospitalmis.repository.DrugRepository;
import com.hospital.hospitalmis.service.DrugBatchService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class DrugBatchServiceImpl implements DrugBatchService {

    private final DrugBatchRepository drugBatchRepository;
    private final DrugRepository drugRepository;

    public DrugBatchServiceImpl(DrugBatchRepository drugBatchRepository,
                                DrugRepository drugRepository) {
        this.drugBatchRepository = drugBatchRepository;
        this.drugRepository = drugRepository;
    }

    private DrugBatchDto toDto(DrugBatch b) {
        DrugBatchDto dto = new DrugBatchDto();
        dto.setId(b.getId());
        dto.setBatchNumber(b.getBatchNumber());
        dto.setExpiryDate(b.getExpiryDate());
        dto.setQuantityOnHand(b.getQuantityOnHand());

        Drug d = b.getDrug();
        if (d != null) {
            dto.setDrugId(d.getId());
            dto.setDrugCode(d.getCode());
            dto.setDrugName(d.getName());
        }

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DrugBatchDto> getAll() {
        return drugBatchRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DrugBatchDto getById(Long id) {
        DrugBatch b = drugBatchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug batch not found"));
        return toDto(b);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DrugBatchDto> getByDrug(Long drugId) {
        return drugBatchRepository.findByDrugIdOrderByExpiryDateAsc(drugId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public DrugBatchDto create(DrugBatchRequest request) {
        Drug drug = drugRepository.findById(request.getDrugId())
                .orElseThrow(() -> new RuntimeException("Drug not found"));

        // option: chặn trùng số lô cho 1 thuốc
        if (drugBatchRepository.existsByDrugIdAndBatchNumber(
                request.getDrugId(), request.getBatchNumber())) {
            throw new RuntimeException("Batch number already exists for this drug");
        }

        DrugBatch b = new DrugBatch();
        b.setDrug(drug);
        b.setBatchNumber(request.getBatchNumber());
        b.setExpiryDate(request.getExpiryDate());
        b.setQuantityOnHand(request.getQuantityOnHand());

        DrugBatch saved = drugBatchRepository.save(b);
        return toDto(saved);
    }

    @Override
    public DrugBatchDto update(Long id, DrugBatchRequest request) {
        DrugBatch b = drugBatchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug batch not found"));

        Drug drug = drugRepository.findById(request.getDrugId())
                .orElseThrow(() -> new RuntimeException("Drug not found"));

        // nếu đổi số lô thì check trùng
        if (!b.getBatchNumber().equals(request.getBatchNumber())
                && drugBatchRepository.existsByDrugIdAndBatchNumber(
                request.getDrugId(), request.getBatchNumber())) {
            throw new RuntimeException("Batch number already exists for this drug");
        }

        b.setDrug(drug);
        b.setBatchNumber(request.getBatchNumber());
        b.setExpiryDate(request.getExpiryDate());
        b.setQuantityOnHand(request.getQuantityOnHand());

        DrugBatch saved = drugBatchRepository.save(b);
        return toDto(saved);
    }

    @Override
    public void delete(Long id) {
        // sau này nếu đã có dispense_item / stock_transaction trỏ vào lô này
        // thì nên chặn xoá (RESTRICT), giờ tạm cho xoá
        drugBatchRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public DrugBatchAllocationResultDto allocateBatches(Long drugId, Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("Quantity must be positive");
        }

        // Lấy thông tin thuốc
        Drug drug = drugRepository.findById(drugId)
                .orElseThrow(() -> new RuntimeException("Drug not found"));

        // Lấy tất cả lô theo thuốc, sort theo HSD tăng dần
        List<DrugBatch> batches = drugBatchRepository.findByDrugIdOrderByExpiryDateAsc(drugId);

        LocalDate today = LocalDate.now();

        int remaining = quantity;
        int totalAllocated = 0;
        List<DrugBatchAllocationItemDto> items = new ArrayList<>();

        for (DrugBatch b : batches) {
            // bỏ qua lô hết hạn hoặc hết hàng
            if (b.getExpiryDate() != null && b.getExpiryDate().isBefore(today)) {
                continue;
            }
            if (b.getQuantityOnHand() == null || b.getQuantityOnHand() <= 0) {
                continue;
            }

            if (remaining <= 0) {
                break;
            }

            int available = b.getQuantityOnHand();
            int take = Math.min(remaining, available);

            DrugBatchAllocationItemDto item = new DrugBatchAllocationItemDto();
            item.setBatchId(b.getId());
            item.setBatchNumber(b.getBatchNumber());
            item.setExpiryDate(b.getExpiryDate());
            item.setQuantityOnHand(available);
            item.setAllocatedQuantity(take);

            items.add(item);

            remaining -= take;
            totalAllocated += take;
        }

        DrugBatchAllocationResultDto result = new DrugBatchAllocationResultDto();
        result.setDrugId(drug.getId());
        result.setDrugCode(drug.getCode());
        result.setDrugName(drug.getName());
        result.setRequestedQuantity(quantity);
        result.setTotalAllocated(totalAllocated);
        result.setEnoughStock(totalAllocated >= quantity);
        result.setItems(items);

        return result;
    }

}
