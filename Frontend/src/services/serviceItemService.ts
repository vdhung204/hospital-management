import axiosClient from '../api/axiosClient';
import type { ServiceItem, ServiceItemRequest, Tariff, TariffRequest } from '@/types/service';

export const serviceItemService = {
  getAll: async () => {
    const res = await axiosClient.get<ServiceItem[]>('/service-items');
    return res.data;
  },
  
  getOne: async (id: number) => {
    const res = await axiosClient.get<ServiceItem>(`/service-items/${id}`);
    return res.data;
  },

  create: async (data: ServiceItemRequest) => {
    const res = await axiosClient.post<ServiceItem>('/service-items', data);
    return res.data;
  },

  update: async (id: number, data: ServiceItemRequest) => {
    const res = await axiosClient.put<ServiceItem>(`/service-items/${id}`, data);
    return res.data;
  },

  delete: async (id: number) => {
    await axiosClient.delete(`/service-items/${id}`);
  },

  // --- Tariff APIs ---
  getTariffs: async (serviceId: number) => {
    const res = await axiosClient.get<Tariff[]>(`/service-items/${serviceId}/tariffs`);
    return res.data;
  },

  addTariff: async (serviceId: number, data: TariffRequest) => {
    const res = await axiosClient.post<Tariff>(`/service-items/${serviceId}/tariffs`, data);
    return res.data;
  }
};