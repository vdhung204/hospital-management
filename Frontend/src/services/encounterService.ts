
import axiosClient from '../api/axiosClient';
import type { Department, EncounterCreateRequest, EncounterDetail, EncounterResponse, Staff } from '@/types/Encounter';

export const encounterService = {
  create: async (data: EncounterCreateRequest) => {
    const response = await axiosClient.post('/encounters', data);
    return response.data;
  },
  getDepartments: async () => {
    const response = await axiosClient.get<Department[]>('/departments');
    return response.data;
  },

  getDoctors: async (departmentId? :number) => {
    const params = departmentId ? {departmentId}: {};
    const response = await axiosClient.get<Staff[]>('/staffs/doctors',{params});
    return response.data;
  },

  getDoctorQueue: async (doctorId: number) => {
    const response = await axiosClient.get<EncounterResponse[]>(`/encounters/doctor-queue/${doctorId}`);
    return response.data;
  },
  getDetail: async (id: number) => {
    const response = await axiosClient.get<EncounterDetail>(`/encounters/${id}/detail`);
    return response.data;
  },
  updateStatus: async (id: number, status: string) => {
    await axiosClient.put(`/encounters/${id}/status`, null, {
        params: { status }
    });
  },
 addNote: async (encounterId: number, data: { noteType: string, content: string, createdBy: number }) => {
    const response = await axiosClient.post(`/encounters/${encounterId}/notes`, data);
    return response.data;
  },
  saveDiagnoses: async (encounterId: number, diagnoses: { icd10Code: string, primary: boolean }) => {
    // Gọi API vừa tạo ở backend
    await axiosClient.post(`/encounters/${encounterId}/diagnoses`, diagnoses);
  },
  getDiagnoses: async (encounterId: number) => {
    const response = await axiosClient.get(`/encounters/${encounterId}/diagnoses`);
    return response.data;
  },

};