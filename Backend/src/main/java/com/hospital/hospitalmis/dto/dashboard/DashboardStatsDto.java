package com.hospital.hospitalmis.dto.dashboard;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DashboardStatsDto {
    private long totalPatientsToday;
    private long newPatientsToday;
    private long pendingEncounters;
    private long completedEncounters;

    private BigDecimal totalRevenueToday;
    private BigDecimal cashRevenueToday;
    private BigDecimal insuranceRevenueToday;

    private long totalPrescriptionsToday;
    private long totalLabTestsToday;
}