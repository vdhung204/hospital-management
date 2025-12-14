import axiosClient from '../api/axiosClient';
import type { InsuranceCard, InsuranceCardRequest, Patient, PatientRequest } from '@/types/Patient';

export const patientService = {
  getAll: async () => {
    // Gọi GET /api/patients
    const response = await axiosClient.get<Patient[]>('/patients');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosClient.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  create: async (data: PatientRequest) => {
    const response = await axiosClient.post<Patient>('/auth/register/patient', {
        ...data,
        username: data.phone, // Tạm lấy SĐT làm username
        password: '123456'       // Mật khẩu mặc định
    });
    return response.data;
  },

  update: async (id: number, data: PatientRequest) => {
    const response = await axiosClient.put<Patient>(`/patients/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axiosClient.delete(`/patients/${id}`);
  },
  // Thêm các hàm này vào patientService hoặc tạo insuranceService riêng
  getInsuranceCards: async (patientId: number) => {
      const res = await axiosClient.get<InsuranceCard[]>(`/patients/${patientId}/insurance-cards`);
      return res.data;
  },
  addInsuranceCard: async (patientId: number, data: InsuranceCardRequest) => {
      const res = await axiosClient.post(`/patients/${patientId}/insurance-cards`, data);
      return res.data;
  },
  updateInsuranceCard: async (patientId: number, cardId: number, data: InsuranceCardRequest) => {
      const res = await axiosClient.put(`/patients/${patientId}/insurance-cards/${cardId}`, data);
      return res.data;
  },
  deleteInsuranceCard: async (patientId: number, cardId: number) => {
      await axiosClient.delete(`/patients/${patientId}/insurance-cards/${cardId}`);
  }
};