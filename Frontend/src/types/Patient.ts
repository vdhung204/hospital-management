export interface Patient {
  id: number;
  patientCode: string; // P0001
  fullName: string;
  dateOfBirth: string; // Dạng 'YYYY-MM-DD'
  gender: string;      // "M" hoặc "F" hoặc "Nam"/"Nữ"
  phone: string;
  idNumber: string;    // CCCD
  address: string;
}

// Dùng cho form thêm mới (không cần id và code vì backend tự sinh)
export interface PatientRequest {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  idNumber: string;
  address: string;
}