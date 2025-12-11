import axiosClient from '../api/axiosClient';

export interface LabRequest {
    serviceItemId: number;
    code: string;
    name: string;
    specimenType: string; // Máu, Nước tiểu...
}

export const labService = {
    // Tạo thông tin xét nghiệm
    create: async (data: LabRequest) => {
        // Gọi vào LabTestController (Backend)
        const res = await axiosClient.post('/lab-tests', data);
        return res.data;
    },

    update: async (id: number, data: LabRequest) => {
        const res = await axiosClient.put(`/lab-tests/${id}`, data);
        return res.data;
    }
};