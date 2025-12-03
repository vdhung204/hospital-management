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
// src/types/encounter.ts

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

export interface Department {
  id: number;
  name: string;
}

export interface Staff {
  id: number;
  fullName: string;
}