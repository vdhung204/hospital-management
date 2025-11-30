package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.dashboard.DashboardMetrics;
import com.hospital.hospitalmis.repository.DrugBatchRepository;
import com.hospital.hospitalmis.repository.EncounterRepository;
import com.hospital.hospitalmis.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class DashboardService {
    private final InvoiceRepository invoiceRepository;
    private final EncounterRepository encounterRepository;
    private final DrugBatchRepository drugBatchRepository;

    // Constructor injection...


    public DashboardService(InvoiceRepository invoiceRepository,
                            EncounterRepository encounterRepository,
                            DrugBatchRepository drugBatchRepository) {
        this.invoiceRepository = invoiceRepository;
        this.encounterRepository = encounterRepository;
        this.drugBatchRepository = drugBatchRepository;
    }

    public DashboardMetrics getTodayMetrics() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(LocalTime.MAX);

        BigDecimal revenue = invoiceRepository.sumRevenue(start, end);
        if (revenue == null) revenue = BigDecimal.ZERO;

        Long encounters = encounterRepository.countEncounters(start, end);

        // Coi như dưới 50 viên là sắp hết
        Long lowStock = drugBatchRepository.countLowStock(500);

        return new DashboardMetrics(revenue, encounters, lowStock);
    }
}