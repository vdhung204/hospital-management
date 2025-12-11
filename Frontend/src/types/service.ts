// src/types/service.ts

export interface Tariff {
  id: number;
  payerType: 'CASH' | 'INSURANCE';
  price: number;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo?: string;
}

export interface ServiceItem {
  id: number;
  code: string;
  name: string;
  serviceType: 'CONSULT' | 'LAB' | 'IMG' | 'DRUG' | 'OTHER';
  departmentId?: number;
  departmentName?: string;
  isActive: boolean;
  tariffs?: Tariff[]; // Danh sách giá đi kèm (nếu load chi tiết)
}

export interface ServiceItemRequest {
  code: string;
  name: string;
  serviceType: string;
  departmentId?: number;
}

export interface TariffRequest {
  payerType: string;
  price: number;
  effectiveFrom: string;
  effectiveTo?: string;
}
export interface BaseFormState {
  code: string;
  name: string;
  serviceType: string;
  departmentId: string | number;
}

export interface DetailFormState {
  // Drug
  activeIngredient: string;
  usageUnit: string;
  form: string;
  strength: string;
  // Lab
  specimenType: string;
  // Imaging
  modality: string;
}

export interface TariffFormState {
  cash: number;
  insurance: number;
}

export interface FilterState {
  keyword: string;
  type: string;
  status: 'all' | 'active' | 'inactive';
}