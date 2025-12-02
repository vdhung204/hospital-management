import axiosClient from '../api/axiosClient';
import type { Patient, PatientRequest } from '@/types/Patient';

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
        password: '123'       // Mật khẩu mặc định
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
};