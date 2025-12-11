import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Printer, CheckCircle, Save } from 'lucide-react';
import { toast } from 'react-toastify';

// Import Services & Types
import { encounterService } from '../../services/encounterService';
import { medicalService } from '../../services/medicalService';
import type { EncounterDetail } from '@/types/Encounter';
import type { Drug, UI_PrescriptionItem } from '@/types/MedicalExam';
import type { ClinicalNote } from '@/types/Encounter';

// Import các Component Con vừa tạo
import DiagnosisTab from '@/components/medicalExam/DiagnosisTab';
import PrescriptionTab from '@/components/medicalExam/PrescriptionTab';
import LabTab from '@/components/medicalExam/LabTab';
import VitalSignsCard from '@/components/medicalExam/VitalSignsCard';

const MedicalExamPage = () => {
  const { id } = useParams();
  const encounterId = Number(id);
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  // --- STATE QUẢN LÝ ---
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'prescription' | 'lab'>('diagnosis');
  const [encounter, setEncounter] = useState<EncounterDetail | null>(null);
  
  // Dữ liệu dùng chung cho các Tab
  const [allDrugs, setAllDrugs] = useState<Drug[]>([]); 
  
  // State của từng Tab (Lifted State Up)
  const [historyNotes, setHistoryNotes] = useState<ClinicalNote[]>([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [icd10, setIcd10] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [noteContent, setNoteContent] = useState(''); // Nội dung đã được format
  const [currentNoteType, setCurrentNoteType] = useState('SOAP'); // Mặc định SOAP
  const [prescriptionItems, setPrescriptionItems] = useState<UI_PrescriptionItem[]>([]);
  const [prescriptionStatus, setPrescriptionStatus] = useState('');
  // --- LOAD DATA ---
  // Sử dụng useCallback để ổn định hàm này
  const initData = useCallback(async () => {
      if (!encounterId) return; // Kiểm tra an toàn

      try {
          const encData = await encounterService.getDetail(encounterId);
          setEncounter(encData);
          
          const drugData = await medicalService.getAllDrugs();
          setAllDrugs(drugData);

          if (encData.status === 'WAITING') {
              encounterService.updateStatus(encounterId, 'IN_PROGRESS');
          }
          if (encData.notes) {
              setHistoryNotes(encData.notes);
          }
          if (encData.prescriptions && encData.prescriptions.length > 0) {
              const savedPrescription = encData.prescriptions[0]; 
              setPrescriptionStatus(savedPrescription.status);
              if (savedPrescription.items) {
                  const mappedItems: UI_PrescriptionItem[] = savedPrescription.items.map((item) => ({
                      tempId: item.id,
                      drugId: item.drugId,
                      drugName: item.drugName,
                      unit: item.form || 'Đv',
                      strength: item.strength,
                      quantity: item.quantity,
                      dose: item.dose,
                      usage: item.dose,
                      frequency: item.frequency,
                      durationDays: item.durationDays
                  }));
                  setPrescriptionItems(mappedItems);
              }
          }
      } catch (error) {
          console.log(error);
          toast.error('Lỗi tải hồ sơ');
      }
  }, [encounterId]); // <--- Dependency: Chỉ tạo lại hàm khi encounterId đổi
  useEffect(() => {
      initData();
  }, [initData]);

  const handleSave = async (isDraft: boolean = false) => {
    if (!encounter) return;
    try {
        let finalContent = noteContent;
        if (diagnosis) {
             finalContent += `\n\n[CHẨN ĐOÁN SƠ BỘ]: ${diagnosis}`;
        }
        if (finalContent.trim()) {
            const newNote = await encounterService.addNote(encounterId, {
                noteType: currentNoteType,
                content: finalContent,
                createdBy: user.userId
            });
            setHistoryNotes(prev => [...prev,newNote]);
            setNoteContent(''); 
            setDiagnosis('');  
        }
        if (icd10.trim()) {
            console.log(icd10);
            await encounterService.saveDiagnoses(encounterId, 
                { 
                  icd10Code: icd10.trim(), 
                  primary: isPrimary           
                }
            );
        }
                // Lưu đơn thuốc
        if (prescriptionItems.length > 0) {
            const apiItems = prescriptionItems.map(i => ({
                drugId: i.drugId,
                quantity: i.quantity,
                dose: i.dose, 
                frequency: i.frequency || 'Hàng ngày',
                durationDays: i.durationDays 
            }));
            await medicalService.createPrescription(encounterId, { items: apiItems });
        }
        // --- HOÀN THÀNH ---
        if (isDraft) {
            toast.success('Đã lưu dữ liệu');
        } else {
            if (window.confirm('Xác nhận hoàn thành?')) {
                await encounterService.updateStatus(encounterId, 'COMPLETED');
                toast.success('Hoàn thành ca khám!');
                navigate('/doctor/queue');
            }
        }

    } catch (error) {
        console.log(error);
        toast.error('Lỗi khi lưu');
    }
  };
  const handlePrint= () => {
    toast.warn("Chức năng đang được phát triển!");
  }
  if (!encounter) return <div className="p-10 text-center">Đang tải...</div>;
  const { patient } = encounter;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col space-y-4 bg-gray-50 p-4">
      {/* HEADER: Giữ nguyên như cũ, chỉ rút gọn code cho dễ nhìn */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/doctor/queue')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><ChevronLeft size={24} /></button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Khám bệnh</h1>
            <div className="text-sm text-gray-500">Mã hồ sơ: <span className="font-mono font-bold text-teal-600">#{encounterId}</span></div>
          </div>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium"
                onClick={() => handlePrint()}
            >
                <Printer size={18} /> In phiếu</button>
            {/* Nút Lưu Nháp */}
    <button 
        onClick={() => handleSave(true)} // Truyền true
        className="flex items-center gap-2 px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 font-medium"
    >
        <Save size={18} /> Lưu lại
    </button>

    {/* Nút Hoàn thành */}
    <button 
        onClick={() => handleSave(false)} // Truyền false
        className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-sm"
    >
        <CheckCircle size={18} /> Hoàn thành
    </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        {/* CỘT TRÁI: THÔNG TIN (Giữ nguyên) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-y-auto pr-1">
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <div className="text-center mb-4">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-700 text-xl font-bold mx-auto mb-2">{patient.fullName.charAt(0)}</div>
                <h3 className="font-bold text-gray-800">{patient.fullName}</h3>
                <p className="text-sm text-gray-500">{patient.patientCode}</p>
             </div>
             <div className="space-y-3 text-sm border-t pt-3">
                <div className="flex justify-between"><span className="text-gray-500">Giới tính</span> <span className="font-medium">{patient.gender}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Ngày sinh</span> <span className="font-medium">{patient.dateOfBirth}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Địa chỉ</span> <span className="font-medium truncate max-w-[150px]">{patient.address}</span></div>
             </div>
          </div>
           <VitalSignsCard 
               encounterId={encounterId}
               initialData={{
                   height: encounter.height,
                   weight: encounter.weight,
                   temperature: encounter.temperature,
                   pulse: encounter.pulse,
                   bloodPressure: encounter.bloodPressure
               }}
               onUpdate={() => {
                   // Khi Card lưu thành công, nó gọi hàm này để load lại dữ liệu mới nhất
                   initData(); 
               }}
           />
        </div>

        {/* CỘT PHẢI: GỌI CÁC TAB COMPONENT */}
        <div className="col-span-12 lg:col-span-9 flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-100">
             {/* Navigation giữ nguyên, chỉ đổi activeTab */}
             <button onClick={() => setActiveTab('diagnosis')} className={`flex-1 py-4 text-sm font-medium border-b-2 ${activeTab==='diagnosis' ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent text-gray-500'}`}>Khám & Chẩn đoán</button>
             <button onClick={() => setActiveTab('lab')} className={`flex-1 py-4 text-sm font-medium border-b-2 ${activeTab==='lab' ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent text-gray-500'}`}>Chỉ định CLS</button>
             <button onClick={() => setActiveTab('prescription')} className={`flex-1 py-4 text-sm font-medium border-b-2 ${activeTab==='prescription' ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent text-gray-500'}`}>Kê đơn thuốc</button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
             {/* Render Conditional */}
             {activeTab === 'diagnosis' && (
                <DiagnosisTab 
                    historyNotes={historyNotes}
                    setNoteContent={setNoteContent}
                    setNoteTypeParent={setCurrentNoteType}
                    diagnosis={diagnosis} setDiagnosis={setDiagnosis}
                    icd10={icd10} setIcd10={setIcd10}
                    isPrimary={isPrimary} setIsPrimary={setIsPrimary}
                    onSave={() => handleSave(true)} 
                />
            )}

            {activeTab === 'lab' && <LabTab />}
            
            {activeTab === 'prescription' && (
                <PrescriptionTab 
                    allDrugs={allDrugs}
                    items={prescriptionItems}
                    setItems={setPrescriptionItems}
                    prescriptionStatus = {prescriptionStatus}
                />
            )}

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalExamPage;