import axiosClient from '../api/axiosClient';

export interface StockImportRequest {
    drugId: number;
    batchNumber: string;
    expiryDate: string; // YYYY-MM-DD
    quantity: number;
    note: string;
}

export const inventoryService = {
    // Gọi vào API POST /api/inventory/import
    importStock: async (data: StockImportRequest) => {
        // Backend trả về text message hoặc lỗi 400
        const res = await axiosClient.post('/inventory/import', data);
        return res.data;
    }
};