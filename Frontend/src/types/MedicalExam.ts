// src/types/medical-exam.ts

// Thuốc (từ kho dược)
export interface Drug {
  id: number;
  code: string;
  name: string;
  form: string;     // Đơn vị (Viên, Lọ...)
  strength: string; // Hàm lượng (500mg...)
  quantityOnHand?: number; // Tồn kho (nếu có API trả về)
}

// Chi tiết đơn thuốc (khi gửi về Backend)
export interface PrescriptionItemRequest {
  drugId: number;
  quantity: number;
  dose: string;      // Liều dùng (Sáng 1...)
  frequency: string; // Tần suất (2 lần/ngày)
  durationDays: number; // Số ngày uống
}

// Gửi về Backend để tạo đơn
export interface PrescriptionCreateRequest {
  items: PrescriptionItemRequest[];
}

export interface UI_PrescriptionItem extends PrescriptionItemRequest {
    tempId: number; // ID tạm thời của frontend
    drugName: string;
    unit: string;
    usage: string; 
}
// src/types/medical-exam.ts (Thêm vào cuối file)

export interface ServiceItem {
  id: number;
  code: string;
  name: string;
  serviceType: 'LAB' | 'IMG' | 'OTHER'; // Phân loại để hiện icon
  price?: number;
}

export interface ClinicalOrder {
  id: number;
  encounterId: number;
  status: string; // ORDERED, IN_PROGRESS, DONE
  createdAt: string;
  items: ClinicalOrderItemResponse[];
}

export interface ClinicalOrderItemRequest {
  itemType: 'LAB_TEST' | 'IMG_PROC'; // Java là String, nhưng ta gán cứng 2 loại này cho chuẩn
  serviceItemId: number;      // Bắt buộc (Long -> number)
  labTestId?: number;         // Optional (Long -> number) - Dành cho Xét nghiệm
  imagingProcedureId?: number;// Optional (Long -> number) - Dành cho CĐHA
}

// 2. DTO gửi đi để tạo phiếu (Khớp với ClinicalOrderCreateRequest.java)
export interface ClinicalOrderCreateRequest {
  orderedBy: number; // ID Bác sĩ (Long -> number)
  items: ClinicalOrderItemRequest[];
}

export interface ClinicalOrderItemResponse {
  id: number;
  serviceItemId: number;
  serviceItemName: string;
  itemType: string; // LAB_TEST, IMG_PROC
  status: string;
}