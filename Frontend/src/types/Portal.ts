// Định nghĩa các Interface

// 1. Khoa phòng
export interface Department {
    id: number;
    name: string;
    code?: string;
}

// 2. Bác sĩ (Staff)
export interface Doctor {
    id: number;
    fullName: string;
    staffCode: string;
    staffType: string;
    departmentId: number;
}

// 3. Lịch hẹn (để check trùng)
export interface MyAppointment {
    id: number;
    scheduledAt: string; // ISO String
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'DONE';
}
export interface PortalAppointment {
    id: number;
    scheduledAt: string;
    departmentName: string;
    doctorName: string;
    status: string;
    reason?: string;
}

export interface PortalEncounterSummary {
    id: number;
    visitDate: string;
    diagnosis?: string; // Tên bệnh chính
    departmentName: string;
    doctorName: string;
}