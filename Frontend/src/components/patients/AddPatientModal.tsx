import { useState } from "react";
import type { PatientPayload } from "@/api/PatientService";

interface AddPatientModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (payload: PatientPayload) => void;
}

export default function AddPatientModal({ show, onClose, onAdd }: AddPatientModalProps) {
  const [form, setForm] = useState<PatientPayload>({
    patientCode: "",
    fullName: "",
    dateOfBirth: "",
    gender: "M",
    phone: "",
    idNumber: "",
    address: "",
  });

  if (!show) return null;

  const update = (key: keyof PatientPayload, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    if (!form.fullName || !form.dateOfBirth) {
      alert("Required fields missing!");
      return;
    }
    onAdd(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[550px] rounded-xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Add New Patient</h2>
        </div>

        {/* BODY */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-semibold text-gray-700">Patient Code</label>
              <input
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-400"
                placeholder="P0001"
                onChange={(e) => update("patientCode", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <input
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-400"
                placeholder="Nguyễn Văn A"
                onChange={(e) => update("fullName", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Gender</label>
              <select
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-400"
                onChange={(e) => update("gender", e.target.value)}
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
              <input
                type="date"
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-400"
                onChange={(e) => update("dateOfBirth", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Phone</label>
              <input
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-400"
                placeholder="0901234567"
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">ID Number</label>
              <input
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-400"
                placeholder="012345678"
                onChange={(e) => update("idNumber", e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-semibold text-gray-700">Address</label>
              <input
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-purple-400"
                placeholder="Address"
                onChange={(e) => update("address", e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 bg-gray-100 px-6 py-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
