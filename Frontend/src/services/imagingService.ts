import axiosClient from '../api/axiosClient';

export interface ImagingRequest {
    serviceItemId: number;
    code: string;
    name: string;
    modality: string; // X-Ray, CT, MRI...
}

export const imagingService = {
    // Tạo thông tin CĐHA
    create: async (data: ImagingRequest) => {
        // Gọi vào ImagingProcedureController (Backend)
        const res = await axiosClient.post('/imaging-procedures', data);
        return res.data;
    },

    update: async (id: number, data: ImagingRequest) => {
        const res = await axiosClient.put(`/imaging-procedures/${id}`, data);
        return res.data;
    }
};