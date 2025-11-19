import { useState, useEffect } from "react";
import type { Patient } from "@/types/Patient";
import AddPatientModal from "@/components/patients/AddPatientModal";
import EditPatientModal from "@/components/patients/EditPatientModel";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast from "@/components/Toast";

import {
  fetchPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "@/api/PatientService";

import type { PatientPayload } from "@/api/PatientService";

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Patient | null>(null);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message: msg, type });
  };

  const loadData = async () => {
    const data = await fetchPatients();
    setPatients(data);
  };

  useEffect(() => {
    (async () => await loadData())();
  }, []);

  const handleAddPatient = async (payload: PatientPayload) => {
    await createPatient(payload);
    await loadData();
    showToast("Patient added successfully!");
    setShowAdd(false);
  };

  const handleEdit = async (id: number, payload: PatientPayload) => {
    await updatePatient(id, payload);
    await loadData();
    showToast("Patient updated successfully!");
    setShowEdit(false);
  };

  const handleDelete = async () => {
    if (!selected) return;
    await deletePatient(selected.id);
    await loadData();
    showToast("Patient deleted successfully!", "success");
    setShowDelete(false);
  };

  return (
    <div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type as "success" | "error"}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <AddPatientModal
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAddPatient}
      />

      <EditPatientModal
        show={showEdit}
        onClose={() => setShowEdit(false)}
        patient={selected}
        onSave={handleEdit}
      />

      <DeleteConfirmModal
        show={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-purple-600">Patients</h1>

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          onClick={() => setShowAdd(true)}
        >
          + Add Patient
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-100 text-purple-700">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">DOB</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-4 py-3">{p.patientCode}</td>
                <td className="px-4 py-3">{p.fullName}</td>
                <td className="px-4 py-3">{p.gender}</td>
                <td className="px-4 py-3">{p.dateOfBirth}</td>
                <td className="px-4 py-3">{p.phone}</td>
                <td className="px-4 py-3">{p.idNumber}</td>
                <td className="px-4 py-3">{p.address}</td>

                <td className="px-4 py-3 text-right">
                  <button
                    className="text-blue-600 mr-4"
                    onClick={() => {
                      setSelected(p);
                      setShowEdit(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600"
                    onClick={() => {
                      setSelected(p);
                      setShowDelete(true);
                    }}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
