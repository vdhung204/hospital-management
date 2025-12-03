
export interface PendingItem {
  id: number;
  itemType: string;         
  serviceItemId: number;
  serviceItemName: string;   
  labTestId?: number;     
  labTestName?: string;      
  imagingProcedureId?: number;
  imagingProcedureName?: string;
  status: string;

  patientName: string;
  patientCode: string;
  patientGender: string;
  patientDob: string;
  doctorName: string;
  orderedAt: string;
}

export interface LabResultRequest {
  parameterName: string;
  resultValue: string;
  unit: string;
  refLow?: string;      
  refHigh?: string;    
  abnormalFlag?: string; 
  validatedBy?: number; }

export interface ImagingResultRequest {
  reportText: string;
  impression: string;
  radiologistId?: number;
  pacsStudyUid?: string; 
  viewerUrl?: string;    
}