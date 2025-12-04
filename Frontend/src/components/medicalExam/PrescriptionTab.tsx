import React, { useState, useMemo } from 'react';
import { Search, Trash2, Pill, Plus,ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Drug, UI_PrescriptionItem } from '@/types/MedicalExam';

interface Props {
  allDrugs: Drug[];
  items: UI_PrescriptionItem[];
  setItems: React.Dispatch<React.SetStateAction<UI_PrescriptionItem[]>>;
  prescriptionStatus: string;
}

const PrescriptionTab = ({ allDrugs, items, setItems,prescriptionStatus }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // State tạm để nhập liệu cho thuốc đang chọn
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [inputData, setInputData] = useState({
    quantity: 1,
    dose: 'Sáng 1, Tối 1 (Sau ăn)', // Gợi ý mặc định
    duration: 5,
    note: ''
  });

  // Filter thuốc (Tìm theo tên hoặc mã)
  const filteredDrugs = useMemo(() => {
    if (!searchTerm) return [];
    return allDrugs.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.code.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10); // Chỉ lấy 10 kết quả đầu để không lag
  }, [allDrugs, searchTerm]);

  // 1. Chọn thuốc từ danh sách gợi ý
  const handleSelectDrug = (drug: Drug) => {
    if (items.find(i => i.drugId === drug.id)) {
        toast.warning('Thuốc này đã có trong đơn!');
        return;
    }
    setSelectedDrug(drug);
    setSearchTerm(''); // Xóa tìm kiếm để ẩn dropdown
    // Reset form nhập liệu
    setInputData({
        quantity: 10,
        dose: 'Sáng 1, Tối 1 (Sau ăn)',
        duration: 5,
        note: ''
    });
  };

  // 2. Thêm thuốc vào danh sách bên phải
  const handleAddToPrescription = () => {
    if (!selectedDrug) return;
    if (inputData.quantity <= 0) {
        toast.warning('Số lượng phải lớn hơn 0');
        return;
    }

    const newItem: UI_PrescriptionItem = {
      tempId: new Date().getTime(), // Dùng time làm ID tạm
      drugId: selectedDrug.id,
      drugName: selectedDrug.name,
      unit: selectedDrug.form || 'Viên',
      
      quantity: inputData.quantity,
      usage: inputData.dose, // Map vào field usage/dose
      dose: inputData.dose,
      frequency: '', 
      durationDays: inputData.duration
    };

    setItems(prev => [...prev, newItem]);
    setSelectedDrug(null); // Reset để chọn thuốc khác
  };

  // 3. Xóa thuốc khỏi đơn
  const handleRemove = (tempId: number) => {
    setItems(prev => prev.filter(i => i.tempId !== tempId));
  };

  return (
    <div className="flex h-full gap-6">
      
      {/* --- CỘT TRÁI: TÌM KIẾM & NHẬP LIỆU --- */}
      <div className="w-[400px] flex-shrink-0 flex flex-col gap-4">
        
        {/* Card Tìm kiếm */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col relative z-20">
            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Search size={18} className="text-teal-600"/> Tìm thuốc
            </h4>
            <div className="relative">
                <input 
                    type="text" autoFocus
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none shadow-sm transition-all"
                    placeholder="Gõ tên thuốc, hoạt chất..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Dropdown Gợi ý */}
                {searchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50">
                        {filteredDrugs.length === 0 ? (
                            <div className="p-4 text-center text-gray-400 italic text-sm">Không tìm thấy thuốc</div>
                        ) : (
                            filteredDrugs.map(d => (
                                <div key={d.id} onClick={() => handleSelectDrug(d)} 
                                    className="p-3 hover:bg-teal-50 cursor-pointer border-b border-gray-50 flex justify-between items-center group transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-800 group-hover:text-teal-700">{d.name}</p>
                                        <p className="text-xs text-gray-500">{d.code} • {d.strength}</p>
                                    </div>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full group-hover:bg-white">{d.form}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Card Nhập chi tiết (Chỉ hiện khi đã chọn thuốc) */}
        {selectedDrug ? (
            <div className="bg-teal-50 rounded-xl border border-teal-100 p-5 flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-2">
                <div className="mb-4 pb-4 border-b border-teal-200">
                    <h3 className="font-bold text-lg text-teal-800">{selectedDrug.name}</h3>
                    <div className="flex gap-3 text-xs text-teal-600 mt-1">
                        <span className="bg-white px-2 py-0.5 rounded border border-teal-200">{selectedDrug.code}</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-teal-200">{selectedDrug.strength}</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-teal-200">{selectedDrug.form}</span>
                    </div>
                </div>

                <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số lượng</label>
                            <input type="number" min="1" className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none text-center font-bold text-lg"
                                value={inputData.quantity} onChange={e => setInputData({...inputData, quantity: Number(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số ngày</label>
                            <input type="number" min="1" className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none text-center"
                                value={inputData.duration} onChange={e => setInputData({...inputData, duration: Number(e.target.value)})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cách dùng / Liều dùng</label>
                        <textarea rows={2} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                            placeholder="Sáng ... viên, Tối ... viên"
                            value={inputData.dose} onChange={e => setInputData({...inputData, dose: e.target.value})} />
                        <div className="flex gap-2 mt-2">
                            {['Sáng 1, Tối 1', 'Sáng 1 (Sau ăn)', 'Khi sốt > 38.5'].map(hint => (
                                <button key={hint} onClick={() => setInputData({...inputData, dose: hint})} 
                                    className="text-[10px] bg-white border border-teal-200 text-teal-600 px-2 py-1 rounded hover:bg-teal-100 transition">
                                    {hint}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button onClick={handleAddToPrescription} className="w-full mt-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-200 transition-transform active:scale-95 flex items-center justify-center gap-2">
                    <Plus size={20}/> Thêm vào đơn
                </button>
            </div>
        ) : (
            <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 border-dashed flex flex-col items-center justify-center text-gray-400 p-6">
                <Pill size={48} className="mb-3 opacity-20"/>
                <p className="text-center text-sm">Vui lòng tìm và chọn thuốc<br/>để kê đơn.</p>
            </div>
        )}
      </div>

      {/* --- CỘT PHẢI: DANH SÁCH ĐƠN THUỐC --- */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
         <div className="bg-orange-50 border-b border-orange-100 px-6 py-4 flex justify-between items-center">
            <h4 className="text-sm font-bold text-orange-800 flex items-center gap-2">
                <ShoppingBag size={18} className="text-orange-600"/> Đơn thuốc ({items.length})
            </h4>
            {items.length > 0 && (
                <span
                    className={`text-xs px-2 py-1 rounded-full font-bold ${
                    prescriptionStatus === 'ACTIVE'
                        ? 'text-orange-600 bg-orange-100' // Active: Cam
                        : 'text-green-600 bg-green-100'   // Đã xong: Xanh lá
                    }`}
                >
                    {prescriptionStatus === 'ACTIVE' ? 'Đang cấp thuốc' : 'Đã xong'}
                </span>
                )}
         </div>

         <div className="flex-1 overflow-y-auto p-0">
            {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                    <Pill size={64} className="mb-4 opacity-20"/> Chưa có thuốc nào trong đơn.
                </div>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3">Tên thuốc</th>
                            <th className="px-4 py-3 w-24 text-center">Số lượng</th>
                            <th className="px-4 py-3">Cách dùng</th>
                            <th className="px-4 py-3 w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((item, idx) => (
                            <tr key={item.tempId} className="hover:bg-orange-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 text-xs font-mono">{idx + 1}</span>
                                        <div>
                                            <p className="font-bold text-gray-800">{item.drugName}</p>
                                            {/* <p className="text-xs text-gray-500">{item.strength} • {item.unit}</p> */}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="inline-block bg-orange-100 text-orange-800 font-bold px-3 py-1 rounded-lg">
                                        {item.quantity}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <p className="text-sm text-gray-700">{item.usage}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Dùng trong {item.durationDays} ngày</p>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <button onClick={() => handleRemove(item.tempId)} 
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
         </div>
         
         {/* Footer tổng kết đơn giản */}
         {items.length > 0 && (
             <div className="bg-gray-50 p-4 border-t border-gray-200 text-right text-sm text-gray-500">
                 Tổng cộng: <span className="font-bold text-gray-800">{items.length} loại thuốc</span>
             </div>
         )}
      </div>

    </div>
  );
};

export default PrescriptionTab;