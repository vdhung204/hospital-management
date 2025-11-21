
package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TariffRepository extends JpaRepository<Tariff, Long> {

    // Lấy các tariff đang hiệu lực cho 1 dịch vụ, 1 loại người trả
    List<Tariff> findByServiceItem_IdAndPayerTypeAndEffectiveFromLessThanEqualAndEffectiveToIsNullOrEffectiveToGreaterThanEqual(
            Long serviceItemId,
            String payerType,
            LocalDate fromDate,
            LocalDate toDate
    );
    @Query("""
        SELECT t FROM Tariff t
        WHERE t.serviceItem.id = :serviceItemId
          AND t.payerType = :payerType
          AND t.effectiveFrom <= :today
          AND (t.effectiveTo IS NULL OR t.effectiveTo >= :today)
        ORDER BY t.effectiveFrom DESC
        """)
    List<Tariff> findActiveTariffs(
            @Param("serviceItemId") Long serviceItemId,
            @Param("payerType") String payerType,
            @Param("today") LocalDate today
    );
    List<Tariff> findByServiceItem_Id(Long serviceItemId);
}
