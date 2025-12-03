
import { useEffect, useState } from 'react';
import { Search, Trash2, Plus, FlaskConical, Image as ImageIcon, CheckCircle, Clock, FileText, Send, Activity } from 'lucide-react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { medicalService } from '@/services/medicalService';
import type { ServiceItem, ClinicalOrder, ClinicalOrderCreateRequest } from '@/types/MedicalExam';
import ViewResultModal from './ViewResultModal';

// DTO cho item đang chọn trên UI
interface SelectedService extends ServiceItem {
    tempId: number;
}

const LabTab = () => {
  const { id } = useParams();
  const encounterId = Number(id);

  // State
  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedService[]>([]);
  const [historyOrders, setHistoryOrders] = useState<ClinicalOrder[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  // State mở modal xem kết quả
  const [viewingItem, setViewingItem] = useState<{id: number, type: string, name: string} | null>(null);

  // Lấy User ID từ local storage
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  // 1. Load dữ liệu ban đầu
  useEffect(() => {
    const loadData = async () => {
        try {
            const services = await medicalService.getAllServices();
            const filtered = services.filter(s => ['LAB', 'IMG'].includes(s.serviceType));
            setAllServices(filtered);

            if (encounterId) {
                const orders = await medicalService.getOrdersByEncounter(encounterId);
                // Sắp xếp mới nhất lên đầu
                setHistoryOrders(orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            }
        } catch (e) { console.error(e); }
    };
    loadData();
  }, [encounterId]);

  // 2. Xử lý Tìm kiếm & Chọn
  const searchResults = allServices.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (service: ServiceItem) => {
    if (selectedItems.find(i => i.id === service.id)) {
        toast.warning('Đã chọn dịch vụ này rồi');
        return;
    }
    const newItem: SelectedService = { ...service, tempId: Date.now() };
    setSelectedItems([...selectedItems, newItem]);
    setSearchTerm(''); 
  };

  const handleRemove = (tempId: number) => {
    setSelectedItems(selectedItems.filter(i => i.tempId !== tempId));
  };

  // 3. Xử lý Gửi Y Lệnh
  const handleSendOrder = async () => {
    if (selectedItems.length === 0) return;
    if (!currentUser?.staffId && !currentUser?.userId) {
        toast.error('Lỗi thông tin bác sĩ'); 
        return;
    }

    setLoading(true);
    try {
        const payload: ClinicalOrderCreateRequest = {
            orderedBy: currentUser.staffId || currentUser.userId,
            items: selectedItems.map(item => ({
                itemType: item.serviceType === 'LAB' ? 'LAB_TEST' : 'IMG_PROC',
                serviceItemId: item.id,
            }))
        };

        await medicalService.createOrder(encounterId, payload);
        toast.success('Đã gửi y lệnh thành công!');
        setSelectedItems([]); 
        
        const orders = await medicalService.getOrdersByEncounter(encounterId);
        setHistoryOrders(orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

    } catch (error) {
        console.error(error);
        toast.error('Gửi y lệnh thất bại');
    } finally {
        setLoading(false);
    }
  };

  const getIcon = (type: string) => {
      if (type === 'LAB' || type === 'LAB_TEST') return <FlaskConical size={18} className="text-blue-500"/>;
      if (type === 'IMG' || type === 'IMG_PROC') return <ImageIcon size={18} className="text-purple-500"/>;
      return <FileText size={18} />;
  };

  return (
    <div className="flex h-full gap-6">
      
      {/* --- CỘT TRÁI (40%): TÌM KIẾM & CHỌN DỊCH VỤ --- */}
      <div className="w-[400px] flex-shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex-1 flex flex-col">
             <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Plus size={18} className="text-teal-600"/> Chỉ định mới
             </h4>
             
             {/* Ô tìm kiếm */}
             <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none shadow-sm"
                    placeholder="Tìm xét nghiệm, X-Quang..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                {/* Dropdown gợi ý */}
                {searchTerm && (
                    <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-20">
                        {searchResults.length === 0 ? (
                            <div className="p-3 text-gray-500 text-sm italic text-center">Không tìm thấy dịch vụ</div>
                        ) : (
                            searchResults.map(s => (
                                <div key={s.id} onClick={() => handleAdd(s)} className="p-3 hover:bg-teal-50 cursor-pointer border-b border-gray-50 flex items-center justify-between transition-colors">
                                    <span className="font-medium text-gray-700">{s.name}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${s.serviceType === 'LAB' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>{s.serviceType}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
             </div>

             {/* Danh sách đang chọn */}
             <div className="flex-1 border border-gray-200 rounded-lg bg-gray-50/50 overflow-hidden flex flex-col">
                <div className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">Dịch vụ đã chọn ({selectedItems.length})</div>
                <div className="flex-1 overflow-y-auto p-0">
                    {selectedItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm p-4">
                            <Activity size={32} className="mb-2 opacity-20"/> Chưa chọn dịch vụ nào
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {selectedItems.map(item => (
                                <div key={item.tempId} className="flex items-center justify-between p-3 bg-white hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        {getIcon(item.serviceType)}
                                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                    </div>
                                    <button onClick={() => handleRemove(item.tempId)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Footer Button */}
                <div className="p-4 border-t bg-white">
                    <button 
                        onClick={handleSendOrder}
                        disabled={selectedItems.length === 0 || loading}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-white shadow-md transition-all ${
                            selectedItems.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:-translate-y-0.5'
                        }`}
                    >
                        {loading ? 'Đang gửi...' : <><Send size={18}/> Gửi Y Lệnh</>}
                    </button>
                </div>
             </div>
          </div>
      </div>

      {/* --- CỘT PHẢI (60%): LỊCH SỬ CHỈ ĐỊNH --- */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
         <div className="bg-blue-50 border-b border-blue-100 px-6 py-4 sticky top-0 z-10">
            <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                <Clock size={18} className="text-blue-600"/> Lịch sử chỉ định ({historyOrders.length} phiếu)
            </h4>
         </div>
         
         <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
            {historyOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                    <FileText size={64} className="mb-4 opacity-20"/> Chưa có y lệnh nào.
                </div>
            ) : (
                historyOrders.map((order) => (
                    <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* Header của 1 Phiếu */}
                        <div className="bg-gray-50/80 px-4 py-3 flex justify-between items-center border-b border-gray-100">
                            <div className="flex gap-3 items-center">
                                <span className="bg-white border border-gray-200 text-gray-600 text-xs font-mono px-2 py-1 rounded">#{order.id}</span>
                                <span className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14}/> {new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                order.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {order.status === 'DONE' ? 'Đã xong' : 'Đang chờ'}
                            </span>
                        </div>
                        
                        {/* Body Phiếu */}
                        <div className="divide-y divide-gray-100">
                            {order.items.map(item => (
                                <div key={item.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                            {getIcon(item.itemType)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-700">{item.serviceItemName}</p>
                                            <p className="text-xs text-gray-400">{item.itemType === 'LAB_TEST' ? 'Xét nghiệm' : 'Chẩn đoán hình ảnh'}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Trạng thái từng item */}
                                    <div>
                                        {item.status === 'DONE' ? (
                                            // <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                            //     <CheckCircle size={14}/> Có kết quả
                                            // </span>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                                    <CheckCircle size={14}/> Có kết quả
                                                </span>
                                                {/* NÚT XEM KẾT QUẢ MỚI */}
                                                <button 
                                                    onClick={() => setViewingItem({ id: item.id, type: item.itemType, name: item.serviceItemName })}
                                                    className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1 mt-1"
                                                >
                                                    <FileText size={12}/> Xem chi tiết
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic bg-gray-100 px-2 py-1 rounded-full">Đang thực hiện...</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
         </div>
      </div>
            {/* --- RENDER MODAL XEM KẾT QUẢ --- */}
       {viewingItem && (
          <ViewResultModal 
             itemId={viewingItem.id}
             itemType={viewingItem.type}
             itemName={viewingItem.name}
             onClose={() => setViewingItem(null)}
          />
       )}
    </div>
  );
};

export default LabTab;