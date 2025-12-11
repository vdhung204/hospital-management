package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.dashboard.DashboardStatsDto;
import com.hospital.hospitalmis.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class DashboardService {

    private final EncounterRepository encounterRepository;
    private final InvoiceRepository invoiceRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final ClinicalOrderRepository clinicalOrderRepository;

    // Constructor Injection
    public DashboardService(EncounterRepository encounterRepository,
                            InvoiceRepository invoiceRepository,
                            PrescriptionRepository prescriptionRepository,
                            ClinicalOrderRepository clinicalOrderRepository) {
        this.encounterRepository = encounterRepository;
        this.invoiceRepository = invoiceRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.clinicalOrderRepository = clinicalOrderRepository;
    }

    public DashboardStatsDto getTodayStats() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        DashboardStatsDto stats = new DashboardStatsDto();

        // 1. Thống kê Lượt khám
        stats.setTotalPatientsToday(encounterRepository.countByVisitDateBetween(startOfDay, endOfDay));
        stats.setPendingEncounters(encounterRepository.countByStatus("IN_PROGRESS")); // Hoặc "WAITING" tùy quy trình

        // 2. Thống kê Doanh thu (Xử lý null nếu chưa có hóa đơn nào)
        BigDecimal revenue = invoiceRepository.sumTotalRevenue(startOfDay, endOfDay);
        stats.setTotalRevenueToday(revenue != null ? revenue : BigDecimal.ZERO);

        BigDecimal insurance = invoiceRepository.sumInsuranceRevenue(startOfDay, endOfDay);
        stats.setInsuranceRevenueToday(insurance != null ? insurance : BigDecimal.ZERO);

        // Doanh thu tiền mặt (ước tính) = Tổng thu - Bảo hiểm (hoặc lấy từ PaymentRepository chính xác hơn)
        stats.setCashRevenueToday(stats.getTotalRevenueToday());

        // 3. Hoạt động khác
        stats.setTotalPrescriptionsToday(prescriptionRepository.countByCreatedAtBetween(startOfDay, endOfDay));
        stats.setTotalLabTestsToday(clinicalOrderRepository.countByCreatedAtBetween(startOfDay, endOfDay));

        return stats;
    }

    // --- API CHO BIỂU ĐỒ (7 NGÀY GẦN NHẤT) ---
    public List<Map<String, Object>> getRevenueChartData() {
        List<Map<String, Object>> data = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Lặp 7 ngày ngược về quá khứ
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.atTime(LocalTime.MAX);

            BigDecimal dailyRev = invoiceRepository.sumTotalRevenue(start, end);

            Map<String, Object> point = new HashMap<>();
            point.put("name", date.getDayOfMonth() + "/" + date.getMonthValue()); // VD: 10/11
            point.put("revenue", dailyRev != null ? dailyRev : BigDecimal.ZERO);

            data.add(point);
        }
        return data;
    }
}