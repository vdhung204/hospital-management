// src/types/dashboard.ts

export interface DashboardStats {
  totalPatientsToday: number;
  newPatientsToday: number;
  pendingEncounters: number;
  completedEncounters: number;
  
  totalRevenueToday: number;
  cashRevenueToday: number;
  insuranceRevenueToday: number;
  
  totalPrescriptionsToday: number;
  totalLabTestsToday: number;
}

export interface RevenueChartData {
  name: string;    // Ngày (VD: 10/11)
  revenue: number; // Doanh thu
}