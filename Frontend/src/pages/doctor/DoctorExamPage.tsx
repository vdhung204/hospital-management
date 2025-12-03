import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Printer, CheckCircle, User,
  Phone, Activity, Stethoscope, Pill, FileText, 
  Search, Trash2, AlertTriangle 
} from 'lucide-react';
import { toast } from 'react-toastify';

// --- 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (TYPES) ---
interface Medicine {
  id: number;
  name: string;
  unit: string;
  activeIngredient: string;
  stock: number;
}

interface PrescriptionItem extends Medicine {
  quantity: number;
  usage: string;
}

// --- 2. DỮ LIỆU GIẢ (MOCK DATA) ---
const MOCK_MEDICINES: Medicine[] = [
  { id: 1, name: 'Panadol Extra', unit: 'Viên', activeIngredient: 'Paracetamol', stock: 1000 },
  { id: 2, name: 'Augmentin 625mg', unit: 'Viên', activeIngredient: 'Amoxicillin', stock: 500 },
  { id: 3, name: 'Alpha Choay', unit: 'Viên', activeIngredient: 'Chymotrypsin', stock: 200 },
  { id: 4, name: 'Berberin', unit: 'Lọ', activeIngredient: 'Berberin', stock: 50 },
  { id: 5, name: 'Zinnat 500mg', unit: 'Viên', activeIngredient: 'Cefuroxime', stock: 120 },
];

const MOCK_PATIENT = {
  id: 'P0001',
  name: 'Nguyễn Văn A',
  gender: 'Nam',
  dob: '1990-05-20',
  age: 34,
  phone: '0901234567',
  address: 'Hà Nội',
  history: ['Dị ứng Penicillin', 'Tiền sử đau dạ dày'], // Cảnh báo dị ứng
  vitals: { bp: '120/80', pulse: 80, temp: 36.5, weight: 70 }
};

const DoctorExamPage = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();

  // --- 3. STATE QUẢN LÝ ---
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'prescription' | 'lab'>('diagnosis');
  
  // State cho kê đơn
  const [prescription, setPrescription] = useState<PrescriptionItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);

  // --- 4. CÁC HÀM XỬ LÝ LOGIC ---

  // Lọc thuốc
  const filteredMedicines = MOCK_MEDICINES.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Thêm thuốc
  const addMedicine = (med: Medicine) => {
    const exists = prescription.find(item => item.id === med.id);
    if (exists) {
      toast.warning('Thuốc này đã có trong đơn!');
      return;
    }
    setPrescription([...prescription, { ...med, quantity: 1, usage: 'Sáng 1, Tối 1 (Sau ăn)' }]);
    setSearchTerm('');
    setShowSuggest(false);
  };

  // Xóa thuốc
  const removeMedicine = (id: number) => {
    setPrescription(prescription.filter(item => item.id !== id));
  };

  // Cập nhật số lượng/cách dùng
  const updateItem = (id: number, field: keyof PrescriptionItem, value: any) => {
    setPrescription(prescription.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Nút Hoàn thành khám
  const handleFinish = () => {
    toast.success('Đã lưu hồ sơ bệnh án thành công!');
    // Logic gọi API lưu ở đây
    navigate('/doctor/queue'); // Quay về hàng chờ
  };

  // --- 5. GIAO DIỆN (UI) ---
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col space-y-4">
      
      {/* HEADER: Tiêu đề & Nút hành động */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Khám bệnh</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              Ca khám: <span className="font-mono font-bold text-teal-600">#{id || '---'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">
                <Printer size={18} /> In toa
            </button>
            <button 
              onClick={handleFinish}
              className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-sm"
            >
                <CheckCircle size={18} /> Hoàn thành
            </button>
        </div>
      </div>

      {/* MAIN CONTENT: Chia 2 cột */}
      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        
        {/* CỘT TRÁI (3/12): Thông tin bệnh nhân (Cố định) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-y-auto pr-1">
          
          {/* Card Thông tin chung */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <div className="text-center mb-4">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-700 text-xl font-bold mx-auto mb-2">
                   {MOCK_PATIENT.name.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-800">{MOCK_PATIENT.name}</h3>
                <p className="text-sm text-gray-500">{MOCK_PATIENT.id} | {MOCK_PATIENT.age} tuổi</p>
             </div>
             
             <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                   <span className="text-gray-500 flex gap-2"><User size={14}/> Giới tính</span>
                   <span className="font-medium">{MOCK_PATIENT.gender}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                   <span className="text-gray-500 flex gap-2"><Phone size={14}/> SĐT</span>
                   <span className="font-medium">{MOCK_PATIENT.phone}</span>
                </div>
             </div>

             {/* Cảnh báo dị ứng (Quan trọng) */}
             <div className="mt-4 bg-red-50 p-3 rounded-lg border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase flex items-center gap-1 mb-1">
                    <AlertTriangle size={12}/> Cảnh báo lâm sàng
                </p>
                <ul className="text-xs text-red-700 list-disc list-inside">
                    {MOCK_PATIENT.history.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
             </div>
          </div>

          {/* Card Sinh hiệu */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <h4 className="font-bold text-gray-700 mb-3 flex gap-2 items-center">
                <Activity size={18} className="text-teal-600"/> Sinh hiệu
             </h4>
             <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-500 block">Huyết áp</span>
                    <span className="font-bold text-gray-800">{MOCK_PATIENT.vitals.bp}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-500 block">Mạch</span>
                    <span className="font-bold text-gray-800">{MOCK_PATIENT.vitals.pulse}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-500 block">Nhiệt độ</span>
                    <span className="font-bold text-gray-800">{MOCK_PATIENT.vitals.temp}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-500 block">Cân nặng</span>
                    <span className="font-bold text-gray-800">{MOCK_PATIENT.vitals.weight}kg</span>
                </div>
             </div>
          </div>
        </div>

        {/* CỘT PHẢI (9/12): Khu vực làm việc chính */}
        <div className="col-span-12 lg:col-span-9 flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-100">
             <button 
                onClick={() => setActiveTab('diagnosis')}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'diagnosis' ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'
                }`}
             >
                <Stethoscope size={18}/> Khám & Chẩn đoán
             </button>
             <button 
                onClick={() => setActiveTab('prescription')}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'prescription' ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'
                }`}
             >
                <Pill size={18}/> Kê đơn thuốc
             </button>
             <button 
                onClick={() => setActiveTab('lab')}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'lab' ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'
                }`}
             >
                <FileText size={18}/> Chỉ định CLS
             </button>
          </div>

          {/* Nội dung Tab */}
          <div className="flex-1 p-6 overflow-y-auto">
             
             {/* TAB 1: CHẨN ĐOÁN */}
             {activeTab === 'diagnosis' && (
                <div className="space-y-5 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Triệu chứng lâm sàng</label>
                            <textarea rows={3} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Bệnh nhân khai..."></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Chẩn đoán chính</label>
                                <input type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Nhập chẩn đoán..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mã ICD-10</label>
                                <input type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Tìm mã bệnh..." />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lời dặn / Ghi chú</label>
                            <textarea rows={3} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Chế độ ăn uống, tái khám..."></textarea>
                        </div>
                    </div>
                </div>
             )}

             {/* TAB 2: KÊ ĐƠN THUỐC */}
             {activeTab === 'prescription' && (
                <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Thanh tìm kiếm thuốc */}
                    <div className="relative mb-4 z-20">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                            <input 
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder="Gõ tên thuốc hoặc hoạt chất để thêm..."
                                value={searchTerm}
                                onChange={(e) => {setSearchTerm(e.target.value); setShowSuggest(true)}}
                                onFocus={() => setShowSuggest(true)}
                            />
                        </div>
                        {/* Gợi ý thuốc dropdown */}
                        {showSuggest && searchTerm && (
                            <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                {filteredMedicines.map(med => (
                                    <div 
                                        key={med.id} 
                                        onClick={() => addMedicine(med)}
                                        className="p-3 hover:bg-teal-50 cursor-pointer flex justify-between items-center border-b border-gray-50"
                                    >
                                        <div>
                                            <p className="font-bold text-gray-800">{med.name}</p>
                                            <p className="text-xs text-gray-500">{med.activeIngredient}</p>
                                        </div>
                                        <div className="text-xs bg-gray-100 px-2 py-1 rounded">Kho: {med.stock}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bảng đơn thuốc */}
                    <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                        <div className="overflow-y-auto flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3">Tên thuốc</th>
                                        <th className="px-4 py-3 w-24 text-center">SL</th>
                                        <th className="px-4 py-3">Cách dùng</th>
                                        <th className="px-4 py-3 w-16 text-center">Xóa</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {prescription.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-gray-400">
                                                <Pill size={40} className="mx-auto mb-2 opacity-20"/>
                                                Chưa có thuốc trong đơn
                                            </td>
                                        </tr>
                                    ) : (
                                        prescription.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <p className="font-bold text-gray-800">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{item.activeIngredient} ({item.unit})</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input 
                                                        type="number" min="1"
                                                        className="w-full text-center border border-gray-300 rounded p-1"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input 
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded p-1 px-2"
                                                        value={item.usage}
                                                        onChange={(e) => updateItem(item.id, 'usage', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button onClick={() => removeMedicine(item.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded">
                                                        <Trash2 size={16}/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
             )}

             {/* TAB 3: CLS (Placeholder) */}
             {activeTab === 'lab' && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <FileText size={48} className="mb-4 opacity-20"/>
                    <p>Chức năng chỉ định Cận lâm sàng đang phát triển...</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorExamPage;