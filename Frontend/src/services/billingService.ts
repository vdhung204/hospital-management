import axiosClient from '../api/axiosClient';
import type { InvoiceDetail, PaymentRequest } from '@/types/Billing';

export const billingService = {
  // 1. Tạo hóa đơn tự động cho ca khám (Gồm tất cả dịch vụ chưa thanh toán)
  createAutoInvoice: async (encounterId: number, isInsurance: boolean) => {
    // Gọi API: POST /api/encounters/{id}/invoices/auto
    const response = await axiosClient.post<InvoiceDetail>(`/encounters/${encounterId}/invoices/auto`, {
        payerType: isInsurance ? 'INSURANCE' : 'CASH',
        includeDrugs: true,
        includeLabs: true,
        includeConsult: true,
        includeImaging: true
    });
    return response.data;
  },

  // 2. Lấy chi tiết hóa đơn (Nếu đã tạo rồi)
  getInvoice: async (id: number) => {
    const response = await axiosClient.get<InvoiceDetail>(`/invoices/${id}`);
    return response.data;
  },

  // 3. Lấy danh sách hóa đơn của 1 ca khám
  getInvoicesByEncounter: async (encounterId: number) => {
    const response = await axiosClient.get<InvoiceDetail[]>(`/encounters/${encounterId}/invoices`);
    return response.data;
  },

  // 4. Thanh toán
  addPayment: async (invoiceId: number, data: PaymentRequest) => {
    const response = await axiosClient.post<InvoiceDetail>(`/invoices/${invoiceId}/payments`, data);
    return response.data;
  },

  deleteInvoice: async (id: number) => {
    await axiosClient.delete(`/invoices/${id}`);
  }
};