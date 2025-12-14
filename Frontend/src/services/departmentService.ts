import axiosClient from "@/api/axiosClient";
import type { Department, DepartmentRequest } from "@/types/Encounter";

// Map với DepartmentDto

export const departmentService = {
  // GET /api/departments
  getAllAdmin: async () => {
    const response = await axiosClient.get<Department[]>('/departments/admin');
    return response.data;
  },
  getAll: async () => {
    const response = await axiosClient.get<Department[]>('/departments');
    return response.data;
  },

  // GET /api/departments/{id}
  getById: async (id: number) => {
    const response = await axiosClient.get<Department>(`/departments/${id}`);
    return response.data;
  },

  // POST /api/departments
  create: async (data: DepartmentRequest) => {
    const response = await axiosClient.post<Department>('/departments', data);
    return response.data;
  },

  // PUT /api/departments/{id}
  update: async (id: number, data: DepartmentRequest) => {
    const response = await axiosClient.put<Department>(`/departments/${id}`, data);
    return response.data;
  },

  // DELETE /api/departments/{id}
  delete: async (id: number) => {
    await axiosClient.delete(`/departments/${id}`);
  },

  restore: async (id: number) => {
    await axiosClient.put(`/departments/${id}/restore`);
  }
};