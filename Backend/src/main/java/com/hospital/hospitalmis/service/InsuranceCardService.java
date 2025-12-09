package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.insurance.InsuranceCardDto;
import com.hospital.hospitalmis.dto.insurance.InsuranceCardRequest;
import com.hospital.hospitalmis.entity.InsuranceCard;
import com.hospital.hospitalmis.entity.Patient;
import com.hospital.hospitalmis.repository.InsuranceCardRepository;
import com.hospital.hospitalmis.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InsuranceCardService {

    private final InsuranceCardRepository insuranceCardRepository;
    private final PatientRepository patientRepository;

    public InsuranceCardService(InsuranceCardRepository insuranceCardRepository, PatientRepository patientRepository) {
        this.insuranceCardRepository = insuranceCardRepository;
        this.patientRepository = patientRepository;
    }

    public List<InsuranceCardDto> getCardsByPatient(Long patientId) {
        return insuranceCardRepository.findByPatient_Id(patientId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public InsuranceCardDto addCard(Long patientId, InsuranceCardRequest req) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (Boolean.TRUE.equals(req.getIsPrimary())) {
            unsetPrimary(patientId);
        }

        InsuranceCard card = new InsuranceCard();
        card.setPatient(patient);
        mapRequestToEntity(req, card);

        return toDto(insuranceCardRepository.save(card));
    }

    public InsuranceCardDto updateCard(Long id, InsuranceCardRequest req) {
        InsuranceCard card = insuranceCardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (Boolean.TRUE.equals(req.getIsPrimary()) && !Boolean.TRUE.equals(card.getPrimary())) {
            unsetPrimary(card.getPatient().getId());
        }

        mapRequestToEntity(req, card);
        return toDto(insuranceCardRepository.save(card));
    }

    public void deleteCard(Long id) {
        insuranceCardRepository.deleteById(id);
    }

    // --- Helpers ---
    private void unsetPrimary(Long patientId) {
        List<InsuranceCard> cards = insuranceCardRepository.findByPatient_Id(patientId);
        for (InsuranceCard c : cards) {
            if (Boolean.TRUE.equals(c.getPrimary())) {
                c.setPrimary(false);
                insuranceCardRepository.save(c);
            }
        }
    }

    private void mapRequestToEntity(InsuranceCardRequest req, InsuranceCard card) {
        card.setCardNumber(req.getCardNumber());
        card.setProvider(req.getProvider());
        card.setValidFrom(req.getValidFrom());
        card.setValidTo(req.getValidTo());
        card.setCoverageRate(req.getCoverageRate());
        card.setPrimary(req.getIsPrimary() != null ? req.getIsPrimary() : false);
    }

    private InsuranceCardDto toDto(InsuranceCard insuranceCard) {
        InsuranceCardDto dto = new InsuranceCardDto();
        dto.setId(insuranceCard.getId());
        dto.setPatientId(insuranceCard.getPatient().getId());
        dto.setCardNumber(insuranceCard.getCardNumber());
        dto.setValidFrom(insuranceCard.getValidFrom());
        dto.setValidTo(insuranceCard.getValidTo());
        dto.setIsPrimary(insuranceCard.getPrimary());
        dto.setCoverageRate(insuranceCard.getCoverageRate());
        dto.setProvider(insuranceCard.getProvider());
        return dto;
    }

}