import { useEffect, useState } from 'react';
import { Pill, CheckCircle, User, Box, AlertCircle, History, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { pharmacyService, type AllocationResult } from '@/services/pharmacyService';
import type { PrescriptionResponse } from '@/types/MedicalExam';
import DispenseHistoryModal from '@/components/pharmacy/DispenseHistoryModal';

const PharmacyPage = () => {
  const [pendingList, setPendingList] = useState<PrescriptionResponse[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [allocations, setAllocations] = useState<Record<number, AllocationResult>>({});
  const [showHistoryModal, setShowHistoryModal] = useState(false);  
  // Lấy User (Dược sĩ)
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
        const data = await pharmacyService.getPendingPrescriptions();
        setPendingList(data);
    } catch (e) { console.error(e); }
  };

  // Hàm tự động chọn lô cho toàn bộ đơn thuốc
  const handleAutoAllocate = async () => {
    if (!selectedPrescription) return;
    setLoading(true);
    const newAllocations: Record<number, AllocationResult> = {};
    let hasError = false;

    try {
        // Chạy vòng lặp qua từng thuốc trong đơn để xin gợi ý lô từ Backend
        for (const item of selectedPrescription.items) {
            const res = await pharmacyService.allocateBatch(item.drugId, item.quantity);
            newAllocations[item.drugId] = res;
            if (!res.enoughStock) hasError = true;
        }
        setAllocations(newAllocations);
        if (hasError) toast.warning('Cảnh báo: Một số thuốc không đủ tồn kho!');
        else toast.success('Đã chọn lô thuốc tự động (FIFO)');
    } catch (e) {
        console.log(e);
        toast.error('Lỗi khi tính toán tồn kho');
    } finally {
        setLoading(false);
    }
  };

  // Hàm Xuất kho
  const handleDispense = async () => {
    if (!selectedPrescription) return;
    
    // Gom tất cả các items từ allocation để gửi xuống backend
    const dispenseItems = [];
    for (const drugId in allocations) {
        const alloc = allocations[drugId];
        for (const batchItem of alloc.items) {
            dispenseItems.push({
                drugBatchId: batchItem.batchId,
                quantity: batchItem.allocatedQuantity
            });
        }
    }

    if (dispenseItems.length === 0) {
        toast.warning('Chưa phân bổ lô thuốc nào (Bấm nút "Chọn lô tự động" trước)');
        return;
    }

    if (!window.confirm('Xác nhận xuất kho và trừ tồn kho?')) return;

    setLoading(true);
    try {
        await pharmacyService.createDispense({
            prescriptionId: selectedPrescription.id,
            pharmacistId: user?.staffId || user?.userId,
            items: dispenseItems
        });
        toast.success('Xuất thuốc thành công!');
        setSelectedPrescription(null);
        setAllocations({});
        loadQueue(); // Refresh danh sách
    } catch (error) {
        console.log(error);
        toast.error('Lỗi khi xuất kho');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 p-4 gap-4">
      
      {/* --- CỘT TRÁI: DANH SÁCH CHỜ --- */}
      <div className="w-1/3 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
         <div className="p-4 border-b bg-teal-50">
            <h3 className="font-bold text-teal-800 flex items-center gap-2"><Pill size={20}/> Chờ cấp phát ({pendingList.length})</h3>
            <button 
                onClick={() => setShowHistoryModal(true)}
                className="text-teal-600 hover:bg-teal-100 p-2 rounded-lg transition-colors"
                title="Xem lịch sử xuất kho"
            >
                <History size={20} />
            </button>
         </div>
         <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {pendingList.map(p => (
                <div 
                    key={p.id} 
                    onClick={() => { setSelectedPrescription(p); setAllocations({}); }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedPrescription?.id === p.id ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-gray-100 hover:border-teal-200'}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-700">Đơn #{p.id}</span>
                        <span className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                        <User size={14}/> BS. {p.prescriberName || 'Unknown'}
                    </div>
                    <div className="text-xs bg-gray-100 inline-block px-2 py-1 rounded text-gray-500">
                        {p.items.length} loại thuốc
                    </div>
                </div>
            ))}
         </div>
      </div>

      {/* --- CỘT PHẢI: CHI TIẾT CẤP PHÁT --- */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
         {selectedPrescription ? (
             <>
                <div className="p-5 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Chi tiết cấp phát</h2>
                        <p className="text-sm text-gray-500">Mã đơn: #{selectedPrescription.id}</p>
                    </div>
                    <button 
                        onClick={handleAutoAllocate}
                        className="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 flex items-center gap-2"
                    >
                        <Box size={18}/> Chọn lô tự động (FIFO)
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Tên thuốc</th>
                                <th className="px-4 py-3 text-center">Yêu cầu</th>
                                <th className="px-4 py-3">Thực xuất (Lô - HSD)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {selectedPrescription.items.map(item => {
                                const alloc = allocations[item.drugId];
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">
                                            {item.drugName} <span className="text-gray-400 font-normal">({item.strength})</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="font-bold text-lg">{item.quantity}</span> {item.form}
                                        </td>
                                        <td className="px-4 py-3">
                                            {!alloc ? (
                                                <span className="text-gray-400 italic text-xs">Chưa chọn lô</span>
                                            ) : (
                                                <div className="space-y-1">
                                                    {!alloc.enoughStock && (
                                                        <div className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={12}/> Không đủ tồn kho</div>
                                                    )}
                                                    {alloc.items.map((batch, idx) => (
                                                        // <div key={idx} className="flex justify-between bg-green-50 px-2 py-1 rounded border border-green-100 text-xs">
                                                        //     <span className="font-mono text-green-700 font-bold">{batch.batchNumber}</span>
                                                        //     <span className="text-gray-500">HSD: {batch.expiryDate}</span>
                                                        //     <div className="flex items-center gap-2">
                                                        //     <span className="font-bold text-green-800 group">SL: {batch.allocatedQuantity}</span>
                                                        //     {/* Nút sửa (Giả lập) - Cho thấy hệ thống hỗ trợ can thiệp */}
                                                        //     <button 
                                                        //         className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded text-blue-600 transition-opacity"
                                                        //         title="Đổi lô khác (Nếu kho thực tế sai lệch)"
                                                        //         onClick={() => toast.info('Chức năng đổi lô thủ công: Dùng khi lô gợi ý không tìm thấy trong kho thực tế.')}
                                                        //     >
                                                        //         <Pencil size={12} />
                                                        //     </button>
                                                        //     </div>
                                                        // </div>
                                                        <div key={idx} className="flex justify-between items-center bg-green-50 px-2 py-1 rounded border border-green-100 text-xs group">
                                                            <div>
                                                                <span className="font-mono text-green-700 font-bold block">{batch.batchNumber}</span>
                                                                <span className="text-gray-500">HSD: {batch.expiryDate}</span>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-green-800 text-sm">SL: {batch.allocatedQuantity}</span>
                                                                
                                                                {/* Nút sửa (Giả lập) - Cho thấy hệ thống hỗ trợ can thiệp */}
                                                                <button 
                                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded text-blue-600 transition-opacity"
                                                                    title="Đổi lô khác (Nếu kho thực tế sai lệch)"
                                                                    onClick={() => toast.info('Chức năng đổi lô thủ công: Dùng khi lô gợi ý không tìm thấy trong kho thực tế.')}
                                                                >
                                                                    <Edit2 size={12} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 border-t bg-gray-50 flex justify-end">
                    <button 
                        onClick={handleDispense}
                        disabled={loading || Object.keys(allocations).length === 0}
                        className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 ${
                            loading || Object.keys(allocations).length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                    >
                       <CheckCircle size={20}/> Xác nhận Xuất thuốc
                    </button>
                </div>
             </>
         ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                 <Pill size={64} className="opacity-20 mb-4"/>
                 <p>Chọn đơn thuốc bên trái để cấp phát</p>
             </div>
         )}
      </div>
      {/* --- HIỂN THỊ MODAL LỊCH SỬ --- */}
      <DispenseHistoryModal 
        isOpen={showHistoryModal} 
        onClose={() => setShowHistoryModal(false)} 
      />
    </div>
  );
};

export default PharmacyPage;