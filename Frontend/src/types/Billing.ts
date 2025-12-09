// src/types/billing.ts

export interface InvoiceLine {
  id: number;
  serviceItemId: number;
  serviceItemName: string;
  quantity: number;
  unitPrice: number;
  lineAmount: number; // Thành tiền
  insuranceAmount: number;
  patientAmount: number; // Tiền BN phải trả
  insuranceBaseUnitPrice?: number;
  patientCopayAmount?: number;
  extraChargeAmount?: number;
}

export interface Payment {
  id: number;
  amount: number;
  method: string; // CASH, QR...
  paidAt: string;
}

export interface InvoiceDetail {
  id: number;
  patientId: number;
  patientName: string;
  patientCode: string;
  encounterId: number;
  
  totalAmount: number;          // Tổng tiền dịch vụ
  totalInsuranceAmount: number; // Bảo hiểm trả
  totalPatientAmount: number;   // Bệnh nhân phải trả (Trước giảm giá)
  
  discount: number;             // Giảm giá
  netAmount: number;            // Số tiền thực thu cuối cùng (Quan trọng)
  // --------------------------------

  status: 'DRAFT' | 'PARTIAL' | 'PAID' | 'CANCELLED';
  createdAt: string;

  totalPatientCopayAmount?: number;
  totalExtraChargeAmount?: number;
  
  lines: InvoiceLine[];
  payments: Payment[];
}

export interface PaymentRequest {
  amount: number;
  method: string; // "CASH", "TRANSFER", "CARD"
  refNumber?: string; // Mã giao dịch ngân hàng
}