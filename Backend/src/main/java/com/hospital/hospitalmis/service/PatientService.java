package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.entity.Patient;
import com.hospital.hospitalmis.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getAll() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getById(Long id) {
        return patientRepository.findById(id);
    }

    public Patient create(Patient p) {
        // sau này anh có thể tự sinh patientCode nếu null
        return patientRepository.save(p);
    }

    public Patient update(Long id, Patient data) {
        return patientRepository.findById(id)
                .map(p -> {
                    p.setFullName(data.getFullName());
                    p.setDateOfBirth(data.getDateOfBirth());
                    p.setGender(data.getGender());
                    p.setPhone(data.getPhone());
                    p.setIdNumber(data.getIdNumber());
                    p.setAddress(data.getAddress());
                    return patientRepository.save(p);
                })
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public void delete(Long id) {
        patientRepository.deleteById(id);
    }
}
