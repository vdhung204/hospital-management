import React, { useEffect, useState } from 'react';
import { X, History, Clock, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { pharmacyService, type DispenseHistory, type DispenseItemDetail } from '@/services/pharmacyService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DispenseHistoryModal = ({ isOpen, onClose }: Props) => {
  const [history, setHistory] = useState<DispenseHistory[]>([]); 
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
        pharmacyService.getAllDispenses()
            .then(data => setHistory(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }
  }, [isOpen]);

  // Hàm toggle mở/đóng
  const toggleRow = (id: number) => {
    if (expandedId === id) {
        setExpandedId(null); 
    } else {
        setExpandedId(id); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col h-[85vh] animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-2xl">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <History className="text-teal-600" size={20}/> Lịch sử xuất kho
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition">
                    <X size={24} />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-0">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-xs sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 w-10"></th> 
                            <th className="px-6 py-3">Mã phiếu</th>
                            <th className="px-6 py-3">Thời gian</th>
                            <th className="px-6 py-3">Bệnh nhân</th>
                            <th className="px-6 py-3">Dược sĩ</th>
                            <th className="px-6 py-3 text-center">SL Thuốc</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={6} className="py-12 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
                        ) : history.length === 0 ? (
                            <tr><td colSpan={6} className="py-12 text-center text-gray-400 italic">Chưa có lịch sử xuất kho</td></tr>
                        ) : (
                            history.map((item) => (
                                <React.Fragment key={item.id}>
                                    {/* DÒNG CHÍNH (HEADER) */}
                                    <tr 
                                        onClick={() => toggleRow(item.id)}
                                        className={`cursor-pointer transition-colors ${expandedId === item.id ? 'bg-teal-50' : 'hover:bg-gray-50'}`}
                                    >
                                        <td className="px-6 py-4 text-gray-400">
                                            {expandedId === item.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                        </td>
                                        <td className="px-6 py-4 font-mono font-bold text-teal-600">#{item.id}</td>
                                        <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                                            <Clock size={14} className="text-gray-400"/>
                                            {new Date(item.dispensedAt).toLocaleString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800">{item.patientName || 'Khách lẻ'}</div>
                                            <div className="text-xs text-gray-500">{item.patientCode}</div>
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {item.pharmacistName ? item.pharmacistName.charAt(0) : 'DS'}
                                            </div>
                                            {item.pharmacistName}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium shadow-sm">
                                                {item.items ? item.items.length : 0} loại
                                            </span>
                                        </td>
                                    </tr>

                                    {/* DÒNG CHI TIẾT (DROPDOWN) - Chỉ hiện khi expandedId khớp */}
                                    {expandedId === item.id && (
                                        <tr className="bg-teal-50/30 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <td colSpan={6} className="px-6 pb-6 pt-0 border-b border-teal-100">
                                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mt-2 ml-8">
                                                    <table className="w-full text-xs text-left">
                                                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase">
                                                            <tr>
                                                                <th className="px-4 py-2">Tên thuốc</th>
                                                                <th className="px-4 py-2">Số lô</th>
                                                                <th className="px-4 py-2">Hạn sử dụng</th>
                                                                <th className="px-4 py-2 text-right">Số lượng xuất</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {item.items.map((detail: DispenseItemDetail, idx: number) => (
                                                                <tr key={idx}>
                                                                    <td className="px-4 py-2 font-medium text-gray-800">
                                                                        {detail.drugName} <span className="text-gray-400 font-normal">({detail.drugCode})</span>
                                                                    </td>
                                                                    <td className="px-4 py-2 font-mono text-blue-600">
                                                                        <div className="flex items-center gap-1">
                                                                            <Package size={12}/> {detail.batchNumber}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-2 text-gray-600">{detail.expiryDate}</td>
                                                                    <td className="px-4 py-2 text-right font-bold text-teal-700 text-sm">
                                                                        {detail.quantity}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-3 border-t bg-gray-50 rounded-b-2xl text-right">
                <span className="text-xs text-gray-500">Hiển thị {history.length} phiếu gần nhất</span>
            </div>
        </div>
    </div>
  );
};

export default DispenseHistoryModal;