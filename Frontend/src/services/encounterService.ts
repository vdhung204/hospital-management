import axiosClient from '../api/axiosClient';
import type { Department, EncounterCreateRequest, EncounterResponse, Staff } from '@/types/Encounter';

export const encounterService = {
  // 1. Tạo lượt khám
  create: async (data: EncounterCreateRequest) => {
    const response = await axiosClient.post('/encounters', data);
    return response.data;
  },

  // 2. Lấy danh sách Khoa (Dropdown)
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
  
  // Hàm cập nhật trạng thái (Bắt đầu khám / Hoàn thành)
  //updateStatus: async (id: number, status: string) => {
      // Backend cần có API update status riêng hoặc dùng update chung
      // Tạm thời giả định bạn dùng API update chung hoặc tạo API patch status
      // Nếu chưa có, bạn có thể gọi API update full object (hơi cồng kềnh)
      // Tốt nhất backend nên có: PUT /api/encounters/{id}/status
      
      // Ở đây mình ví dụ gọi PUT update full (cách lười), nhưng đúng ra nên viết API riêng ở BE
      // await axiosClient.put(`/encounters/${id}/status`, { status });
  //}
};