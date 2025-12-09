import { useEffect, useState } from 'react';
import { FlaskConical, Image as ImageIcon, Search,FileText, Clock, RefreshCw} from 'lucide-react';
import { toast } from 'react-toastify';
import { technicianService } from '../../services/technicianService';
import type { PendingItem } from '@/types/Technician';
import ResultModal from '@/components/technician/ResultModal'; 

const TechnicianPage = () => {
  const [activeTab, setActiveTab] = useState<'LAB' | 'IMG'>('LAB');
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State để mở Modal nhập kết quả
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
        let data = [];
        if (activeTab === 'LAB') {
            data = await technicianService.getPendingLabs();
        } else {
            data = await technicianService.getPendingImaging();
        }
        setItems(data);
    } catch (error) {
        console.error(error);
        toast.error('Lỗi tải danh sách chờ');
    } finally {
        setLoading(false);
    }
  };

  // Filter tìm kiếm
  const filteredItems = items.filter(i => 
    // i.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || // Cần backend trả về patientName
    // i.patientCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.serviceItemName.toLowerCase().includes(searchTerm.toLowerCase())
  );
return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-800 flex flex-col">

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6">
        
        {/* Statistics / Quick Filters (Optional Decoration) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
           <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-gray-500 text-sm font-medium">Tổng yêu cầu chờ</p>
                 <p className="text-2xl font-bold text-gray-800">{items.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                 <Clock size={24} />
              </div>
           </div>
           {/* Add more stats if needed */}
        </div>

        {/* --- MAIN CARD --- */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Toolbar */}
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
             
             {/* Tab Switcher */}
             <div className="flex bg-gray-100/80 p-1.5 rounded-lg w-fit">
                <button 
                    onClick={() => setActiveTab('LAB')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                        activeTab === 'LAB' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'
                    }`}
                >
                    <FlaskConical size={18}/> Xét nghiệm
                </button>
                <button 
                    onClick={() => setActiveTab('IMG')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                        activeTab === 'IMG' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'
                    }`}
                >
                    <ImageIcon size={18}/> Chẩn đoán hình ảnh
                </button>
             </div>

             {/* Search & Actions */}
             <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="relative max-w-md w-full md:w-80 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18}/>
                    <input 
                        type="text" 
                        placeholder="Tìm tên, mã BN, dịch vụ..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    onClick={loadData} 
                    className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                    title="Làm mới"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
             </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 text-gray-500 font-semibold text-xs uppercase tracking-wider sticky top-0 z-10">
                    <tr>
                        <th className="px-6 py-4 border-b border-gray-100 w-20">#ID</th>
                        <th className="px-6 py-4 border-b border-gray-100">Bệnh nhân</th>
                        <th className="px-6 py-4 border-b border-gray-100">Dịch vụ yêu cầu</th>
                        <th className="px-6 py-4 border-b border-gray-100">Người chỉ định</th>
                        <th className="px-6 py-4 border-b border-gray-100 text-right">Thao tác</th>
                    </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                       // Loading Skeleton
                       [...Array(5)].map((_, i) => (
                           <tr key={i} className="animate-pulse">
                               <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-10"></div></td>
                               <td className="px-6 py-4"><div className="h-10 bg-gray-200 rounded w-48"></div></td>
                               <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                               <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                               <td className="px-6 py-4"></td>
                           </tr>
                       ))
                    ) : filteredItems.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="py-20 text-center text-gray-400">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-300">
                                        <FileText size={32}/>
                                    </div>
                                    <p>Không có yêu cầu nào phù hợp</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filteredItems.map(item => (
                            <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors">
                                
                                {/* ID & Time */}
                                <td className="px-6 py-4 align-top">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">
                                            #{item.id}
                                        </span>
                                        <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                                            <Clock size={10} />
                                            {new Date(item.orderedAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                </td>

                                {/* Patient Info */}
                                <td className="px-6 py-4 align-top">
                                    <div className="flex gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${
                                            item.patientGender === 'Nam' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-pink-600'
                                        }`}>
                                            {item.patientName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors cursor-pointer">
                                                {item.patientName}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 font-medium">
                                                    {item.patientCode}
                                                </span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                                    {new Date().getFullYear() - new Date(item.patientDob).getFullYear()} tuổi
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Service Info */}
                                <td className="px-6 py-4 align-top">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg mt-0.5 ${
                                            item.itemType === 'LAB_TEST' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                        }`}>
                                            {item.itemType === 'LAB_TEST' ? <FlaskConical size={18}/> : <ImageIcon size={18}/>}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{item.serviceItemName}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                                     item.itemType === 'LAB_TEST' 
                                                     ? 'bg-blue-50 text-blue-600 border-blue-100' 
                                                     : 'bg-purple-50 text-purple-600 border-purple-100'
                                                }`}>
                                                    {item.itemType === 'LAB_TEST' ? 'Xét nghiệm' : 'CĐHA'}
                                                </span>
                                                {/* Simulated status badge */}
                                                <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> Chờ thực hiện
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Doctor Info */}
                                <td className="px-6 py-4 align-top">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                            BS
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">{item.doctorName}</span>
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 align-middle text-right">
                                    <button 
                                        onClick={() => setSelectedItem(item)}
                                        className="group/btn inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-200 hover:shadow-lg transition-all active:scale-95"
                                    >
                                        <FileText size={16} className="group-hover/btn:animate-bounce-subtle"/> 
                                        <span>Nhập KQ</span>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
          </div>
          
          {/* Pagination (Visual only) */}
          <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
              <span>Hiển thị {filteredItems.length} kết quả</span>
              <div className="flex gap-1">
                  <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50" disabled>Trước</button>
                  <button className="px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded shadow-sm">1</button>
                  <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100">2</button>
                  <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100">Sau</button>
              </div>
          </div>

        </div>
      </main>

    {/* Modal nhập kết quả */}
      {selectedItem && (
        <ResultModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
            onSuccess={() => {
                setSelectedItem(null);
                loadData(); // Reload list sau khi lưu xong
            }} 
        />
      )}
    </div>
  );
};

export default TechnicianPage;