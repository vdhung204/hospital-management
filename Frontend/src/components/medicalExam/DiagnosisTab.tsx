import React, { useEffect, useRef, useState } from 'react';
import { 
    Clock, User, FileText, ChevronDown, 
    Activity, Stethoscope, ClipboardList, 
    Plus, X, Save, AlertCircle
} from 'lucide-react';
import { NOTE_TYPES, type ClinicalNote, type NoteType } from '@/types/Encounter';
import { encounterService } from '@/services/encounterService'; // Import service để load/xóa chẩn đoán
import { useParams } from 'react-router-dom';

// --- Type nội bộ cho Diagnosis ---
interface DiagnosisItem {
    id: number;
    icd10Code: string;
    icd10Name: string;
    primary: boolean;
}

// --- CÁC COMPONENT FORM CON (GIỮ NGUYÊN) ---
interface SoapProps { onChange: (content: string) => void; }

const SoapForm = ({ onChange }: SoapProps) => {
    const [data, setData] = React.useState({ s: '', o: '', a: '', p: '' });
    const handleChange = (field: string, value: string) => {
        const newData = { ...data, [field]: value };
        setData(newData);
        onChange(`S: ${newData.s}\nO: ${newData.o}\nA: ${newData.a}\nP: ${newData.p}`);
    };
    // ... (Giữ nguyên giao diện SOAP 4 ô màu sắc đẹp ở bài trước)
    return (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <label className="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-1"><User size={12}/> S (Hỏi bệnh)</label>
                    <textarea className="w-full bg-transparent border-0 focus:ring-0 p-0 text-sm min-h-[80px] resize-none outline-none" 
                        placeholder="Bệnh nhân than phiền gì?..." onChange={e => handleChange('s', e.target.value)} />
                </div>
                <div className="bg-green-50/50 p-3 rounded-lg border border-green-100">
                    <label className="text-xs font-bold text-green-600 uppercase mb-2 flex items-center gap-1"><Stethoscope size={12}/> O (Khám thấy)</label>
                    <textarea className="w-full bg-transparent border-0 focus:ring-0 p-0 text-sm min-h-[80px] resize-none outline-none" 
                        placeholder="Mạch, nhiệt, nghe phổi..." onChange={e => handleChange('o', e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100">
                    <label className="text-xs font-bold text-orange-600 uppercase mb-2 flex items-center gap-1"><Activity size={12}/> A (Đánh giá)</label>
                    <textarea className="w-full bg-transparent border-0 focus:ring-0 p-0 text-sm min-h-[60px] resize-none outline-none" 
                        placeholder="Biện luận chẩn đoán..." onChange={e => handleChange('a', e.target.value)} />
                </div>
                <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                    <label className="text-xs font-bold text-purple-600 uppercase mb-2 flex items-center gap-1"><ClipboardList size={12}/> P (Kế hoạch)</label>
                    <textarea className="w-full bg-transparent border-0 focus:ring-0 p-0 text-sm min-h-[60px] resize-none outline-none" 
                        placeholder="Hướng điều trị..." onChange={e => handleChange('p', e.target.value)} />
                </div>
            </div>
        </div>
    );
};

const GeneralForm = ({ onChange }: { onChange: (val: string) => void }) => (
    <div className="animate-in fade-in">
        <textarea rows={8} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm leading-relaxed"
            placeholder="Nhập diễn biến bệnh..." onChange={(e) => onChange(e.target.value)} />
    </div>
);

// --- COMPONENT CHÍNH ---
interface Props {
  historyNotes: ClinicalNote[];
  setNoteContent: (content: string) => void;
  setNoteTypeParent: (type: string) => void;
  diagnosis: string;
  setDiagnosis: (val: string) => void;
  // --- Thêm các props cho ICD10 ---
  icd10: string;
  setIcd10: (val: string) => void;
  isPrimary: boolean;
  setIsPrimary: (val: boolean) => void;
  
  onSave: () => void;
}

const DiagnosisTab = ({ 
    historyNotes, setNoteContent, setNoteTypeParent, 
    diagnosis, setDiagnosis, 
    icd10, setIcd10, isPrimary, setIsPrimary,
    onSave 
}: Props) => {
  const { id } = useParams();
  const encounterId = Number(id);
  
  const [selectedType, setSelectedType] = useState<NoteType>('SOAP');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notesEndRef = useRef<HTMLDivElement>(null);
  
  // State danh sách chẩn đoán (Load riêng)
  const [diagnosesList, setDiagnosesList] = useState<DiagnosisItem[]>([]);

  // Load danh sách chẩn đoán
  useEffect(() => {
      const loadDiagnoses = async () => {
          try {
              const data = await encounterService.getDiagnoses(encounterId);
              setDiagnosesList(data);
          } catch (e) { console.error(e); }
      };
      if (encounterId) loadDiagnoses();
  }, [encounterId, isModalOpen]); // Reload khi đóng mở modal (để cập nhật mới nhất)

  // Auto scroll
  useEffect(() => {
    notesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historyNotes]);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
  };

  const handleTypeChange = (type: NoteType) => {
    setSelectedType(type);
    setNoteTypeParent(type);
    setNoteContent('');
  };

  const handleSaveInternal = () => {
      onSave(); // Gọi hàm lưu của cha (Lưu Note + Lưu ICD10 mới)
      setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col relative">
      
      {/* KHU VỰC CHÍNH (Chia 2 cột: Trái Timeline - Phải Chẩn đoán) */}
      <div className="flex-1 flex gap-4 overflow-hidden">
          
          {/* CỘT TRÁI (65%): TIMELINE LỊCH SỬ */}
          <div className="flex-[2] bg-gray-50 rounded-xl border border-gray-200 flex flex-col overflow-hidden">
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2"><Clock size={18} className="text-teal-600"/> Lịch sử diễn biến ({historyNotes.length})</h4>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 shadow-md transition-transform hover:scale-105 font-medium text-sm">
                    <Plus size={18} /> Viết diễn biến
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* ... (Code hiển thị Timeline giữ nguyên như cũ) ... */}
                {historyNotes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm"><FileText size={48} className="mb-4 opacity-20"/>Chưa có ghi chú nào.</div>
                ) : (
                    historyNotes.map((item, index) => (
                        <div key={item.id || index} className="relative pl-8 border-l-2 border-gray-200 last:border-l-0 pb-4">
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${item.noteType === 'SOAP' ? 'bg-teal-500' : 'bg-pink-500'}`}></div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{item.createdByName ? item.createdByName.charAt(0) : 'BS'}</div>
                                        <span className="font-bold text-gray-700">{item.createdByName || 'Bác sĩ'}</span>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">{item.noteType}</span>
                                    </div>
                                    <span className="text-gray-400 text-xs font-mono">{formatTime(item.createdAt)}</span>
                                </div>
                                <div className="text-gray-800 whitespace-pre-wrap font-mono leading-relaxed pl-1">{item.content}</div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={notesEndRef} />
            </div>
          </div>

          {/* CỘT PHẢI (35%): DANH SÁCH CHẨN ĐOÁN */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
             <div className="bg-orange-50 border-b border-orange-100 px-4 py-3 flex items-center gap-2 sticky top-0 z-10">
                <Activity size={18} className="text-orange-600"/>
                <h4 className="text-sm font-bold text-orange-800">Chẩn đoán xác định</h4>
             </div>
             <div className="flex-1 overflow-y-auto p-0">
                {diagnosesList.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm italic">Chưa có chẩn đoán ICD-10</div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <tbody className="divide-y divide-gray-100">
                            {diagnosesList.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-start gap-2">
                                            <span className="font-mono font-bold text-orange-700 bg-orange-100 px-1.5 rounded text-xs mt-0.5">{d.icd10Code}</span>
                                            <div>
                                                <p className="text-gray-800 font-medium leading-tight">{d.icd10Name}</p>
                                                {d.primary && <span className="inline-flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-1.5 rounded border border-red-100 mt-1">Bệnh chính</span>}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
             </div>
          </div>
      </div>

      {/* 2. MODAL NHẬP LIỆU (POPUP) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                
                {/* Header Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-teal-600" size={20}/> Ghi chép diễn biến & Chẩn đoán
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Body Modal (Scrollable) */}
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cột Trái: Chọn loại & Form Note */}
                        <div className="lg:col-span-2 space-y-5">
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="text-sm font-bold text-gray-700">Mẫu phiếu:</label>
                                <div className="relative flex-1">
                                    <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        value={selectedType} onChange={(e) => handleTypeChange(e.target.value as NoteType)}>
                                        {NOTE_TYPES.map(t => <option key={t.code} value={t.code}>{t.label}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none"/>
                                </div>
                            </div>

                            {selectedType === 'SOAP' ? <SoapForm onChange={setNoteContent} /> : <GeneralForm onChange={setNoteContent} />}
                        </div>

                        {/* Cột Phải: Chẩn đoán */}
                        <div className="lg:col-span-1 space-y-5 border-l pl-8 border-gray-100">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Chẩn đoán sơ bộ (Text)</label>
                                <textarea rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                                    placeholder="VD: Viêm họng cấp..." value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                            </div>
                            
                            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                                <label className="block text-xs font-bold text-orange-700 uppercase mb-3 flex items-center gap-1">
                                    <Activity size={14}/> Thêm ICD-10
                                </label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Mã bệnh</label>
                                        <div className="relative">
                                            <input type="text" className="w-full p-2.5 pl-9 bg-white border border-orange-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-orange-400 outline-none uppercase placeholder:normal-case"
                                                placeholder="VD: J02.9" value={icd10} onChange={(e) => setIcd10(e.target.value.toUpperCase())} />
                                            <AlertCircle size={16} className="absolute left-2.5 top-2.5 text-orange-400"/>
                                        </div>
                                    </div>
                                    
                                    <label className="flex items-center gap-2 cursor-pointer select-none bg-white p-2 rounded-lg border border-orange-100 hover:border-orange-300 transition">
                                        <input type="checkbox" className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                                            checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} />
                                        <span className="text-sm font-medium text-gray-700">Đây là bệnh chính</span>
                                    </label>
                                    
                                    <p className="text-[10px] text-gray-400 italic mt-2">* Nhập mã chính xác để lưu vào hệ thống.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-white transition">
                        Hủy
                    </button>
                    <button onClick={handleSaveInternal} className="px-6 py-2.5 rounded-lg bg-teal-600 text-white font-bold shadow-lg hover:bg-teal-700 transition flex items-center gap-2">
                        <Save size={18}/> Lưu vào hồ sơ
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisTab;