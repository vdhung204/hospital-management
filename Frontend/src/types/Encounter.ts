export interface EncounterCreateRequest {
  patientId: number;
  departmentId: number;
  doctorId: number;
  encounterType: string; 
  
  height?: number;
  weight?: number;
  temperature?: number;
  bloodPressure?: string;
  pulse?: number;
  
  appointmentId?: number; 
}
export interface EncounterResponse {
  id: number;
  patientId: number;
  patientName: string;
  patientCode: string; 
  patientGender?: string; 
  patientDob?: string;   
  
  departmentName: string;
  queueNumber: number; 
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  visitDate: string;
  
  bloodPressure?: string;
  pulse?: number;
}
export interface PatientSummary {
  id: number;
  patientCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
}

export interface EncounterDetail {
  id: number;
  visitDate: string;
  status: string;
  encounterType: string;
  patient: PatientSummary;
  height?: number;
  weight?: number;
  temperature?: number;
  bloodPressure?: string;
  pulse?: number;

  notes: ClinicalNote[];
}
export interface Department {
  id: number;
  name: string;
}

export interface Staff {
  id: number;
  fullName: string;
}
export interface ClinicalNote {
  id: number;
  encounterId: number;
  noteType: string;
  content: string;
  createdBy: number; 
  createdByName: string; 
  createdAt: string; 
}

export type NoteType = 'SOAP' | 'GENERAL' | 'NURSING';

export const NOTE_TYPES = [
    { code: 'SOAP', label: 'Bệnh án SOAP (Bác sĩ)' },
    { code: 'GENERAL', label: 'Diễn biến / Ghi chú thường' },
    { code: 'NURSING', label: 'Phiếu chăm sóc (Điều dưỡng)' }
];