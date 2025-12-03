import React, { useState } from 'react';
import { Search, Trash2, Pill } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Drug, UI_PrescriptionItem } from '@/types/MedicalExam';

interface Props {
  allDrugs: Drug[];
  items: UI_PrescriptionItem[];
  setItems: React.Dispatch<React.SetStateAction<UI_PrescriptionItem[]>>;
}

const PrescriptionTab = ({ allDrugs, items, setItems }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);

  // Filter thuốc từ danh sách tổng
  const filteredDrugs = allDrugs.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Thêm thuốc
  const addDrug = (drug: Drug) => {
    if (items.find(i => i.drugId === drug.id)) {
      toast.warning('Thuốc đã có trong đơn');
      return;
    }
    const newItem: UI_PrescriptionItem = {
      tempId: new Date().getTime(),
      drugId: drug.id,
      drugName: drug.name,
      unit: drug.form || 'Viên',
      quantity: 1,
      dose: '',
      frequency: '',
      durationDays: 5,
      usage: 'Sáng 1, Tối 1 (Sau ăn)', 
    };
    setItems([...items, newItem]);
    setSearchTerm('');
    setShowSuggest(false);
  };

  // Xóa thuốc
  const removeDrug = (tempId: number) => {
    setItems(items.filter(i => i.tempId !== tempId));
  };

  // Sửa số lượng/cách dùng
  const updateItem = (tempId: number, field: string, value: string | number) => {
    setItems(prev => prev.map(item => 
      item.tempId === tempId ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Search Bar */}
      <div className="relative mb-4 z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
          <input 
            type="text" 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
            placeholder="Tìm thuốc (Tên hoặc Mã)..."
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setShowSuggest(true)}}
            onFocus={() => setShowSuggest(true)}
          />
        </div>
        {/* Suggestion Dropdown */}
        {showSuggest && searchTerm && (
          <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {filteredDrugs.length === 0 ? (
                <div className="p-3 text-gray-500 text-sm">Không tìm thấy thuốc</div>
            ) : (
                filteredDrugs.map(d => (
                <div key={d.id} onClick={() => addDrug(d)} className="p-3 hover:bg-teal-50 cursor-pointer border-b border-gray-50 last:border-0">
                    <p className="font-bold text-gray-800">{d.name}</p>
                    <p className="text-xs text-gray-500">{d.code} | {d.strength}</p>
                </div>
                ))
            )}
          </div>
        )}
      </div>

      {/* Table List */}
      <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">Tên thuốc</th>
                <th className="px-4 py-3 w-24">SL</th>
                <th className="px-4 py-3">Cách dùng</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.tempId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {item.drugName} 
                    <span className="text-gray-400 text-xs ml-1">({item.unit})</span>
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" min="1" className="w-full border border-gray-300 rounded p-1 text-center focus:border-teal-500 outline-none" 
                      value={item.quantity} onChange={(e) => updateItem(item.tempId, 'quantity', Number(e.target.value))}/>
                  </td>
                  <td className="px-4 py-3">
                    <input type="text" className="w-full border border-gray-300 rounded p-1 px-2 focus:border-teal-500 outline-none" 
                      value={item.usage} onChange={(e) => updateItem(item.tempId, 'usage', e.target.value)}/>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => removeDrug(item.tempId)} className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition">
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">
                    <Pill size={40} className="mx-auto mb-2 opacity-20"/>
                    <p>Chưa có thuốc nào trong đơn</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionTab;