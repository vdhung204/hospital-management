package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.InvoiceLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceLineRepository extends JpaRepository<InvoiceLine, Long> {

    List<InvoiceLine> findByInvoice_Id(Long invoiceId);
    boolean existsBySourceTypeAndSourceId(String sourceType, Long sourceId);

}
