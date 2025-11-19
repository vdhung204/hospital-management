import axios from "axios";

const API_URL = "http://localhost:8080/api/patients"; // sửa theo backend của anh

export interface PatientPayload {
  patientCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  idNumber: string;
  address: string;
}

export async function fetchPatients() {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function createPatient(payload: PatientPayload) {
  const res = await axios.post(API_URL, payload);
  return res.data;
}

export async function updatePatient(id: number, payload: PatientPayload) {
  const res = await axios.put(`${API_URL}/${id}`, payload);
  return res.data;
}

export async function deletePatient(id: number) {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
}
