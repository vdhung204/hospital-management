// src/services/medicalService.ts
import axiosClient from '../api/axiosClient';
import type { ClinicalOrder, ClinicalOrderCreateRequest, Drug, PrescriptionCreateRequest, ServiceItem } from '@/types/MedicalExam';

export const medicalService = {
  // 1. Tìm kiếm thuốc (API GET /api/drugs)
  // Thực tế nên có API search: /api/drugs/search?keyword=...
  // Tạm dùng getAll rồi filter ở frontend nếu data ít
  getAllDrugs: async () => {
    const response = await axiosClient.get<Drug[]>('/drugs');
    return response.data;
  },

  // 2. Tạo đơn thuốc (API POST /api/encounters/{id}/prescriptions)
  createPrescription: async (encounterId: number, data: PrescriptionCreateRequest) => {
    const response = await axiosClient.post(`/encounters/${encounterId}/prescriptions`, data);
    return response.data;
  },

    getAllServices: async () => {
    const response = await axiosClient.get<ServiceItem[]>('/service-items');
    return response.data;
  },
  createOrder: async (encounterId: number, data: ClinicalOrderCreateRequest) => {
    const response = await axiosClient.post(`/encounters/${encounterId}/orders`, data);
    return response.data;
  },
  getOrdersByEncounter: async (encounterId: number) => {
    const response = await axiosClient.get<ClinicalOrder[]>(`/encounters/${encounterId}/orders`);
    return response.data;
  },
  getLabResults: async (itemId: number) => {
    const response = await axiosClient.get(`/orders/items/${itemId}/lab-results`);
    return response.data;
  },
  getImagingResults: async (itemId: number) => {
    const response = await axiosClient.get(`/orders/items/${itemId}/imaging-results`);
    return response.data;
  }
};