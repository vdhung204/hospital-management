
export interface Drug {
  id: number;
  code: string;
  name: string;
  form: string;     
  strength: string; 
  quantityOnHand?: number; 
}
export interface PrescriptionItemRequest {
  drugId: number;
  quantity: number;
  dose: string;      
  frequency: string; 
  durationDays: number; 
}
export interface PrescriptionCreateRequest {
  items: PrescriptionItemRequest[];
}
export interface UI_PrescriptionItem extends PrescriptionItemRequest {
    tempId: number; 
    drugName: string;
    unit: string;
    usage: string; 
}
export interface PrescriptionItemResponse {
  id: number;
  drugId: number;
  drugCode: string;
  drugName: string;
  form: string;
  strength: string;
  dose: string;
  frequency: string;
  durationDays: number;
  quantity: number;
}

export interface PrescriptionResponse {
  id: number;
  encounterId: number;
  prescriberId?: number;
  prescriberName?: string;
  createdAt: string;
  status: string; 
  items: PrescriptionItemResponse[];
}
export interface ServiceItem {
  id: number;
  code: string;
  name: string;
  serviceType: 'LAB' | 'IMG' | 'OTHER';
  price?: number;
}

export interface ClinicalOrder {
  id: number;
  encounterId: number;
  status: string;
  createdAt: string;
  items: ClinicalOrderItemResponse[];
}

export interface ClinicalOrderItemRequest {
  itemType: 'LAB_TEST' | 'IMG_PROC'; 
  serviceItemId: number;    
  labTestId?: number;       
  imagingProcedureId?: number;
}
export interface ClinicalOrderCreateRequest {
  orderedBy: number;
  items: ClinicalOrderItemRequest[];
}

export interface ClinicalOrderItemResponse {
  id: number;
  serviceItemId: number;
  serviceItemName: string;
  itemType: string; 
  status: string;
}