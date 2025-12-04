import axiosClient from '../api/axiosClient';
import type { PrescriptionResponse } from '@/types/MedicalExam';

export interface DispenseCreateRequest {
  prescriptionId: number;
  pharmacistId?: number;
  items: {
    drugBatchId: number;
    quantity: number;
  }[];
}

export interface AllocationResult {
  drugId: number;
  drugName: string;
  totalAllocated: number;
  enoughStock: boolean;
  items: {
    batchId: number;
    batchNumber: string;
    expiryDate: string;
    allocatedQuantity: number;
  }[];
}
export interface DispenseItemDetail {
  id: number;
  drugId: number;
  drugCode: string;
  drugName: string;
  batchId: number;
  batchNumber: string;
  expiryDate: string; // Java LocalDate -> string "yyyy-MM-dd"
  quantity: number;
}
export interface DispenseHistory {
  id: number;
  prescriptionId: number;
  patientName: string; // Mới thêm
  patientCode: string; // Mới thêm
  pharmacistName: string;
  dispensedAt: string;
  items: DispenseItemDetail[]; // Chi tiết thuốc
}
export const pharmacyService = {
  // 1. Lấy danh sách đơn chờ
  getPendingPrescriptions: async () => {
    const response = await axiosClient.get<PrescriptionResponse[]>('/prescriptions/pending');
    return response.data;
  },
  getAllDispenses: async () => {
    const response = await axiosClient.get<DispenseHistory[]>('/dispenses');
    return response.data;
  },

  // 2. Gợi ý chọn lô (Auto Allocate) - Gọi API /api/drug-batches/allocate
  allocateBatch: async (drugId: number, quantity: number) => {
    const response = await axiosClient.post<AllocationResult>('/drug-batches/allocate', {
        drugId, quantity
    });
    return response.data;
  },

  // 3. Thực hiện xuất kho (Dispense)
  createDispense: async (data: DispenseCreateRequest) => {
    const response = await axiosClient.post('/dispenses', data);
    return response.data;
  }
};