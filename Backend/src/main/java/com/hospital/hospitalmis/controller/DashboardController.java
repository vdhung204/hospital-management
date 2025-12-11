package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.dashboard.DashboardStatsDto;
import com.hospital.hospitalmis.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // 1. Lấy số liệu tổng quan
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        return ResponseEntity.ok(dashboardService.getTodayStats());
    }

    // 2. Lấy dữ liệu vẽ biểu đồ
    @GetMapping("/revenue-chart")
    public ResponseEntity<List<Map<String, Object>>> getChartData() {
        return ResponseEntity.ok(dashboardService.getRevenueChartData());
    }
}