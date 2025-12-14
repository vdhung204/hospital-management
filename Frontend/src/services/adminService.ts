import axiosClient from '../api/axiosClient';

export interface AuditLog {
  id: number;
  userId: number;
  username: string;
  action: string;      // CREATE, UPDATE, DELETE...
  entityName: string;  // Encounter, Invoice...
  entityId: number;
  createdAt: string;
  details: string;     // JSON hoặc Text mô tả
}
export interface EncounterDTO {
  id: number;
  patientId: number;
  patientName: string;
  patientCode: string;
  departmentName: string;
  doctorId:string;
  doctorName?: string; 
  visitDate: string;
  status: string;
  queueNumber?: number;
}

export interface FilterEncounter{
  keyword: string,
  departmentId: string | null ,
  status: string | null,
  fromDate: string,
  toDate: string
}

export const adminService = {
    getAuditLogs: async () => {
    const response = await axiosClient.get<AuditLog[]>('/admin/audit-logs');
    return response.data;
  },
  
  // (Optional) Lấy log theo đối tượng cụ thể
  getEntityLogs: async (entityName: string, entityId: number) => {
    const response = await axiosClient.get<AuditLog[]>(`/admin/audit-logs/entity/${entityName}/${entityId}`);
    return response.data;
  },
  searchEncounter: async (params: FilterEncounter) => {
    // params: { keyword, departmentId, status, fromDate, toDate }
    const response = await axiosClient.get<EncounterDTO[]>('/admin/encounters', { params });
    return response.data;
  },
  
  deleteEmcounter: async (id: number) => {
    await axiosClient.delete(`/encounters/${id}`);
  }
};