import axiosClient from '../api/axiosClient';

export interface DrugRequest {
    serviceItemId: number; // ID liên kết (Quan trọng)
    code: string;
    name: string;
    activeIngredient: string; // Hoạt chất
    usageUnit: string;        // Đơn vị (Viên/Vỉ)
    form: string;             // Dạng bào chế
    strength: string;         // Hàm lượng
}

export const drugService = {
    // Tạo thông tin thuốc (Bước 2 trong Wizard)
    create: async (data: DrugRequest) => {
        // Gọi vào DrugController (Backend)
        const res = await axiosClient.post('/drugs', data);
        return res.data;
    },

    // Cập nhật (Nếu cần sau này)
    update: async (id: number, data: DrugRequest) => {
        const res = await axiosClient.put(`/drugs/${id}`, data);
        return res.data;
    }
};