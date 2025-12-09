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

export interface PatientRequest {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  idNumber: string;
  address: string;
}

export interface InsuranceCard {
    id: number;
    patientId: number;
    cardNumber: string;
    provider: string;
    validFrom: string;
    validTo: string;
    coverageRate: number;
    isPrimary: boolean;
}

export interface InsuranceCardRequest {
    cardNumber: string;
    provider: string;
    validFrom: string;
    validTo: string;
    coverageRate: number;
    isPrimary: boolean;
}