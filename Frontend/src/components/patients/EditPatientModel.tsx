import { useState, useEffect } from "react";
import type { Patient } from "@/types/Patient";
import type { PatientPayload } from "@/api/PatientService";

interface Props {
  show: boolean;
  onClose: () => void;
  patient: Patient | null;
  onSave: (id: number, payload: PatientPayload) => void;
}

export default function EditPatientModal({ show, onClose, patient, onSave }: Props) {
  const [form, setForm] = useState<PatientPayload>({
    patientCode: "",
    fullName: "",
    dateOfBirth: "",
    gender: "M",
    phone: "",
    idNumber: "",
    address: "",
  });

  useEffect(() => {
  if (patient) {
    Promise.resolve().then(() => {
      setForm({
        patientCode: patient.patientCode,
        fullName: patient.fullName,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        phone: patient.phone,
        idNumber: patient.idNumber,
        address: patient.address,
      });
    });
  }
}, [patient]);


  const update = (key: keyof PatientPayload, value: string) => {
    setForm({ ...form, [key]: value });
  };

  if (!show || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[550px]">

        {/* Header */}
        <div className="bg-purple-600 text-white text-lg font-semibold px-4 py-2 rounded">
          Edit Patient
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label>Patient Code</label>
            <input className="border rounded p-2 w-full" 
              value={form.patientCode}
              readOnly
            />
          </div>

          <div>
            <label>Full Name</label>
            <input className="border rounded p-2 w-full"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </div>

          <div>
            <label>Gender</label>
            <select className="border rounded p-2 w-full"
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              className="border rounded p-2 w-full"
              value={form.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
            />
          </div>

          <div>
            <label>Phone</label>
            <input className="border rounded p-2 w-full"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          <div>
            <label>ID Number</label>
            <input className="border rounded p-2 w-full"
              value={form.idNumber}
              onChange={(e) => update("idNumber", e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label>Address</label>
            <input className="border rounded p-2 w-full"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            onClick={() => onSave(patient.id, form)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
