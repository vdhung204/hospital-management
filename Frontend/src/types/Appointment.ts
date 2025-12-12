// src/types/appointment.ts

// Enum trạng thái để code đỡ bị sai chính tả
export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'DONE';

// 1. Type hiển thị trên danh sách (Output)
export interface Appointment {
    id: number;
    patientId: number;
    patientCode: string;
    patientName: string;
    
    departmentId?: number;
    departmentName?: string;
    
    doctorId?: number;
    doctorName?: string;
    
    scheduledAt: string; // ISO String (2025-10-20T09:00:00)
    status: AppointmentStatus;
    reason?: string;
}

// 2. Type gửi lên để tạo mới (Input)
export interface CreateAppointmentRequest {
    patientId?: number;
    departmentId?: number | null;
    doctorId?: number | null;
    scheduledAt: string; // ISO String
    reason?: string;
}

// 3. Type cho bộ lọc tìm kiếm
export interface AppointmentSearchParams {
    patientId?: number;
    doctorId?: number;
    departmentId?: number;
    fromDate?: string; // YYYY-MM-DD
    toDate?: string;   // YYYY-MM-DD
    status?: AppointmentStatus;
}

// 4. Các Type phụ trợ cho Dropdown (Patient, Doctor, Dept)
export interface PatientOption {
    id: number;
    fullName: string;
    patientCode: string;
}

export interface DoctorOption {
    id: number;
    fullName: string;
    staffType: string; // 'DOCTOR'
}

export interface DepartmentOption {
    id: number;
    name: string;
}