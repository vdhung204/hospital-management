package com.hospital.hospitalmis.service.impl;

import com.hospital.hospitalmis.dto.prescription.*;
import com.hospital.hospitalmis.entity.*;
import com.hospital.hospitalmis.repository.*;
import com.hospital.hospitalmis.service.PrescriptionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    private final EncounterRepository encounterRepository;
    private final StaffRepository staffRepository;
    private final DrugRepository drugRepository;

    public PrescriptionServiceImpl(
            PrescriptionRepository prescriptionRepository,
            PrescriptionItemRepository prescriptionItemRepository,
            EncounterRepository encounterRepository,
            StaffRepository staffRepository,
            DrugRepository drugRepository
    ) {
        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionItemRepository = prescriptionItemRepository;
        this.encounterRepository = encounterRepository;
        this.staffRepository = staffRepository;
        this.drugRepository = drugRepository;
    }

    private PrescriptionItemDto toItemDto(PrescriptionItem item) {
        PrescriptionItemDto dto = new PrescriptionItemDto();
        dto.setId(item.getId());
        dto.setDose(item.getDose());
        dto.setFrequency(item.getFrequency());
        dto.setDurationDays(item.getDurationDays());
        dto.setQuantity(item.getQuantity());

        Drug drug = item.getDrug();
        if (drug != null) {
            dto.setDrugId(drug.getId());
            dto.setDrugCode(drug.getCode());
            dto.setDrugName(drug.getName());
            dto.setForm(drug.getForm());
            dto.setStrength(drug.getStrength());
        }

        return dto;
    }

    private PrescriptionDetailDto toDetailDto(Prescription p) {
        PrescriptionDetailDto dto = new PrescriptionDetailDto();
        dto.setId(p.getId());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setStatus(p.getStatus());

        if (p.getEncounter() != null) {
            dto.setEncounterId(p.getEncounter().getId());
        }

        if (p.getPrescriber() != null) {
            dto.setPrescriberId(p.getPrescriber().getId());
            dto.setPrescriberName(p.getPrescriber().getFullName()); // field trong Staff
        }

        List<PrescriptionItemDto> itemDtos =
                p.getItems().stream().map(this::toItemDto).toList();
        dto.setItems(itemDtos);
        return dto;
    }

    @Override
    public PrescriptionDetailDto createPrescription(Long encounterId, PrescriptionCreateRequest request) {
        Prescription prescription = prescriptionRepository.findByEncounter_Id(encounterId)
                .stream()
                .filter(p -> "ACTIVE".equals(p.getStatus()))
                .findFirst()
                .orElse(null);

        if (prescription == null) {
            Encounter encounter = encounterRepository.findById(encounterId)
                    .orElseThrow(() -> new RuntimeException("Encounter not found"));

            Staff prescriber = null;
            if (request.getPrescriberId() != null) {
                prescriber = staffRepository.findById(request.getPrescriberId()).orElse(null);
            } else if (encounter.getDoctorId() != null) {
                prescriber = staffRepository.findById(encounter.getDoctorId()).orElse(null);
            }

            prescription = new Prescription();
            prescription.setEncounter(encounter);
            prescription.setPrescriber(prescriber);
            prescription.setCreatedAt(LocalDateTime.now());
            prescription.setStatus("ACTIVE");
            prescription = prescriptionRepository.save(prescription);
        } else {
            prescription.getItems().clear();
            prescription.setCreatedAt(LocalDateTime.now());
        }

        if (request.getItems() != null) {
            for (PrescriptionItemRequest itemReq : request.getItems()) {
                Drug drug = drugRepository.findById(itemReq.getDrugId())
                        .orElseThrow(() -> new RuntimeException("Drug not found: " + itemReq.getDrugId()));

                if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                    throw new RuntimeException("Quantity must be > 0 for drug " + drug.getName());
                }

                PrescriptionItem item = new PrescriptionItem();
                item.setPrescription(prescription);
                item.setDrug(drug);
                item.setDose(itemReq.getDose());
                item.setFrequency(itemReq.getFrequency());
                item.setDurationDays(itemReq.getDurationDays());
                item.setQuantity(itemReq.getQuantity());

                prescriptionItemRepository.save(item);
            }
        }
        return toDetailDto(prescription);
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionDetailDto getById(Long id) {
        Prescription p = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        return toDetailDto(p);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionDetailDto> getByEncounter(Long encounterId) {
        return prescriptionRepository.findByEncounter_Id(encounterId)
                .stream()
                .map(this::toDetailDto)
                .toList();
    }

    @Override
    public List<PrescriptionDetailDto> getPendingPrescriptions() {
        return prescriptionRepository.findPendingPrescriptions()
                .stream()
                .map(this::toDetailDto)
                .collect(Collectors.toList());
    }
    @Override
    public PrescriptionDetailDto cancelPrescription(Long id) {
        Prescription p = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        p.setStatus("CANCELLED");
        Prescription saved = prescriptionRepository.save(p);
        return toDetailDto(saved);
    }
}
