export interface StockimportRequest{
    drugId: number;
    batchNumber: string;
    expiryDate: string;
    quantity: number;
    notel: string;
}
// Các type cần thiết
export interface DrugOption {
  id: number;
  code: string;
  name: string;
  form: string; // VD: Viên, Lọ
  activeIngredient?: string;
  isActive: boolean;
}

export interface ImportItem {
  tempId: number; // ID tạm để render list
  drugId: number;
  drugCode: string;
  drugName: string;
  unit: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
}
export interface DrugBatch {
  id: number;
  drugId: number;
  drugCode: string;
  drugName: string;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  quantityOnHand: number;
}