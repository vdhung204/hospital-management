import type { DrugBatch, DrugOption } from '@/types/Inventory';
import axiosClient from '../api/axiosClient';

export interface StockImportRequest {
    drugId: number;
    batchNumber: string;
    expiryDate: string; // YYYY-MM-DD
    quantity: number;
    note: string;
}

export const inventoryService = {
    getAllBatches: async () => {
    const response = await axiosClient.get<DrugBatch[]>('/drug-batches');
    return response.data;
  },

  // Lấy danh mục thuốc (Dropdown)
  getAllDrugs: async () => {
    const response = await axiosClient.get<DrugOption[]>('/drugs');
    return response.data;
  },
    // Gọi vào API POST /api/inventory/import
    importStock: async (data: StockImportRequest) => {
        // Backend trả về text message hoặc lỗi 400
        const res = await axiosClient.post('/inventory/import', data);
        return res.data;
    }
};