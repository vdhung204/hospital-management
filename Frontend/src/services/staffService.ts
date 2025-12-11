import axiosClient from '../api/axiosClient';

// Khớp với StaffRegisterRequest của Java
export interface StaffRegisterRequest {
    username: string;
    password?: string; // Optional khi update
    fullName: string;
    gender: string;
    dateOfBirth: string;
    phone: string;
    email: string;
    idNumber: string;
    address: string;
    staffType: string;
    position: string;
    departmentId?: number;
    hireDate: string;
}

export const staffService = {
    getAll: async () => {
        const res = await axiosClient.get('/staffs');
        return res.data;
    },
    
    // Gọi vào API registerStaff của bạn
    // Lưu ý: Kiểm tra lại URL Controller của bạn là /auth/register-staff hay /admin/staffs
    create: async (data: StaffRegisterRequest) => {
        const res = await axiosClient.post('auth/admin/register/staff', data); 
        return res.data;
    },
    
    // API lấy danh sách khoa phòng để fill dropdown
    getDepartments: async () => {
        // Giả sử có API này, nếu chưa có thì hardcode tạm
        const res = await axiosClient.get('/departments'); 
        return res.data;
    },
    getRoles: async () => {
        // Giả sử có API này, nếu chưa có thì hardcode tạm
        const res = await axiosClient.get('/staffs/roles'); 
        return res.data;
    },
    update: async (id: number, data: StaffRegisterRequest) => {
        const res = await axiosClient.put(`/staffs/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        await axiosClient.delete(`/staffs/${id}`);
    },
    toggleStatus: async (id: number) => {
        await axiosClient.patch(`/staffs/${id}/toggle-status`);
    }
};