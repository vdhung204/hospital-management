package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    List<Invoice> findByEncounter_Id(Long encounterId);

    List<Invoice> findByPatient_Id(Long patientId);
}
