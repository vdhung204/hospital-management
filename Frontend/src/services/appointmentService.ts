import type { Appointment, AppointmentSearchParams, CreateAppointmentRequest } from '@/types/Appointment';
import axiosClient from '../api/axiosClient';

export const appointmentService = {
    // Tìm kiếm (Mặc định tìm theo ngày)
    search: async (params: AppointmentSearchParams) => {
        const res = await axiosClient.get<Appointment[]>('/appointments', { params });
        return res.data;
    },
    
    create: async (data: CreateAppointmentRequest) => {
        const res = await axiosClient.post('/appointments', data);
        return res.data;
    },

    // Gọi API check-in vừa thêm ở Backend
    checkIn: async (id: number) => {
        const res = await axiosClient.post(`/appointments/${id}/check-in`);
        return res.data; // Trả về encounterId
    },

    cancel: async (id: number) => {
        await axiosClient.post(`/appointments/${id}/cancel`);
    },

    createForPatient: async (data: CreateAppointmentRequest) => {
        // Gọi vào API mà chúng ta đã định nghĩa ở PatientPortalController
        const res = await axiosClient.post('/portal/appointments', data);
        return res.data;
    },

    getSlots: async (doctorId: number, date: string) => {
    const res = await axiosClient.get<string[]>(`/appointments/doctors/${doctorId}/slots?date=${date}`);
    return res.data;
    },
    getMyAppointments: async (view: 'all' | 'upcoming' = 'upcoming') => {
        const res = await axiosClient.get(`/portal/appointments?view=${view}`);
        return res.data;
    }
};