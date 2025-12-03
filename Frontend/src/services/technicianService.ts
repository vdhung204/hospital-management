// src/services/technicianService.ts
import axiosClient from '../api/axiosClient';
import type { ImagingResultRequest, LabResultRequest, PendingItem } from '@/types/Technician';

export const technicianService = {
  getPendingLabs: async () => {
    const response = await axiosClient.get<PendingItem[]>('/clinical-orders/pending-labs');
    return response.data;
  },

  getPendingImaging: async () => {
    const response = await axiosClient.get<PendingItem[]>('/clinical-orders/pending-imaging');
    return response.data;
  },

  submitLabResult: async (itemId: number, data: LabResultRequest) => {
    const response = await axiosClient.post(`/orders/items/${itemId}/lab-results`, data);
    return response.data;
  },

  submitImagingResult: async (itemId: number, data: ImagingResultRequest) => {
    const response = await axiosClient.post(`/orders/items/${itemId}/imaging-results`, data);
    return response.data;
  }
};