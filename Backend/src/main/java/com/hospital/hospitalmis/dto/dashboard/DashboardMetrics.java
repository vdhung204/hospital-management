package com.hospital.hospitalmis.dto.dashboard;

import java.math.BigDecimal;

public class DashboardMetrics {
    private BigDecimal todayRevenue; // Doanh thu hôm nay
    private Long todayEncounters;    // Số ca khám hôm nay
    private Long lowStockDrugs;      // Số thuốc sắp hết hàng

    // Constructor, Getters, Setters
    public DashboardMetrics(BigDecimal todayRevenue, Long todayEncounters, Long lowStockDrugs) {
        this.todayRevenue = todayRevenue;
        this.todayEncounters = todayEncounters;
        this.lowStockDrugs = lowStockDrugs;
    }
    // ... getter setter ...

    public BigDecimal getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(BigDecimal todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public Long getTodayEncounters() {
        return todayEncounters;
    }

    public void setTodayEncounters(Long todayEncounters) {
        this.todayEncounters = todayEncounters;
    }

    public Long getLowStockDrugs() {
        return lowStockDrugs;
    }

    public void setLowStockDrugs(Long lowStockDrugs) {
        this.lowStockDrugs = lowStockDrugs;
    }
}