package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    List<Invoice> findByEncounter_Id(Long encounterId);

    List<Invoice> findByPatient_Id(Long patientId);

    // Tính tổng tiền các hóa đơn ĐÃ THANH TOÁN (PAID) trong khoảng thời gian
    @Query("SELECT SUM(i.netAmount) FROM Invoice i " +
            "WHERE i.status = 'PAID' AND i.createdAt " +
            "BETWEEN :start AND :end")
    BigDecimal sumRevenue(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
