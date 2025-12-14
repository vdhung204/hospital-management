import { useEffect, useState, useMemo } from 'react';
import { 
  Package, Search, Plus, AlertTriangle, 
  Archive, Calendar, RefreshCcw, ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { inventoryService } from '@/services/inventoryService';
import type { DrugBatch } from '@/types/Inventory';
import { handleError } from '@/utils/errorHandler';

const PharmacyInventoryPage = () => {
  const navigate = useNavigate(); // Hook điều hướng
  
  // --- STATE ---
  const [batches, setBatches] = useState<DrugBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'EXPIRED' | 'LOW_STOCK'>('ALL');

  // --- EFFECT ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getAllBatches();
      setBatches(data);
    } catch (error) {

      handleError(error,'Lỗi tải dữ liệu kho');
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC TÍNH TOÁN (Stats & Filter) ---
  const stats = useMemo(() => {
    const totalItems = batches.reduce((acc, b) => acc + b.quantityOnHand, 0);
    const expiredCount = batches.filter(b => new Date(b.expiryDate) < new Date()).length;
    const lowStockCount = batches.filter(b => b.quantityOnHand < 50 && b.quantityOnHand > 0).length;
    return { totalItems, expiredCount, lowStockCount };
  }, [batches]);

  const filteredBatches = useMemo(() => {
    return batches.filter(b => {
      const matchKey = b.drugName.toLowerCase().includes(keyword.toLowerCase()) || 
                       b.batchNumber.toLowerCase().includes(keyword.toLowerCase()) ||
                       b.drugCode.toLowerCase().includes(keyword.toLowerCase());
      
      let matchStatus = true;
      const today = new Date();
      const exp = new Date(b.expiryDate);
      
      if (filterStatus === 'EXPIRED') matchStatus = exp < today;
      else if (filterStatus === 'LOW_STOCK') matchStatus = b.quantityOnHand < 50;

      return matchKey && matchStatus;
    });
  }, [batches, keyword, filterStatus]);

  // --- HELPERS ---
  const getExpiryStatus = (dateStr: string) => {
    const today = new Date();
    const exp = new Date(dateStr);
    const diffTime = exp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-xs border border-red-100">Đã hết hạn</span>;
    if (diffDays < 90) return <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded text-xs border border-orange-100">Hết hạn trong {diffDays} ngày</span>;
    return <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs border border-green-100">Còn hạn</span>;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Archive className="text-teal-600"/> Quản lý Kho Dược
          </h1>
          <p className="text-slate-500 text-sm">Theo dõi tồn kho, hạn sử dụng và cảnh báo.</p>
        </div>
        
        {/* NÚT CHUYỂN HƯỚNG SANG TRANG NHẬP KHO */}
        <button 
          onClick={() => navigate('/inventory/inbound')} 
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-teal-200 flex items-center gap-2 transition-transform active:scale-95 group"
        >
          <Plus size={20}/> 
          <span>Tạo phiếu nhập kho</span>
          <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all"/>
        </button>
      </div>

      {/* 2. Stats Cards (Dashboard Mini) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
           <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Tổng tồn kho</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalItems.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-1">Đơn vị thuốc</p>
           </div>
           <div className="p-4 bg-blue-50 text-blue-600 rounded-full"><Package size={28}/></div>
        </div>
        
        <div 
            onClick={() => setFilterStatus('LOW_STOCK')}
            className={`cursor-pointer p-5 rounded-xl shadow-sm border transition-all flex items-center justify-between ${filterStatus === 'LOW_STOCK' ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-500/20' : 'bg-white border-slate-200 hover:border-orange-200 hover:shadow-md'}`}
        >
           <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Sắp hết hàng</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{stats.lowStockCount}</p>
              <p className="text-xs text-slate-400 mt-1">Dưới định mức an toàn</p>
           </div>
           <div className="p-4 bg-orange-100 text-orange-600 rounded-full"><AlertTriangle size={28}/></div>
        </div>

        <div 
            onClick={() => setFilterStatus('EXPIRED')}
            className={`cursor-pointer p-5 rounded-xl shadow-sm border transition-all flex items-center justify-between ${filterStatus === 'EXPIRED' ? 'bg-red-50 border-red-200 ring-2 ring-red-500/20' : 'bg-white border-slate-200 hover:border-red-200 hover:shadow-md'}`}
        >
           <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Đã hết hạn</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.expiredCount}</p>
              <p className="text-xs text-slate-400 mt-1">Cần thanh lý / hủy</p>
           </div>
           <div className="p-4 bg-red-100 text-red-600 rounded-full"><Calendar size={28}/></div>
        </div>
      </div>

      {/* 3. Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
           <input 
              type="text" 
              placeholder="Tìm tên thuốc, mã thuốc, số lô..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
           />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
           <button 
              onClick={() => setFilterStatus('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filterStatus === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
           >
              Tất cả
           </button>
           <button 
              onClick={() => setFilterStatus('LOW_STOCK')}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filterStatus === 'LOW_STOCK' ? 'bg-orange-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-700'}`}
           >
              Sắp hết hàng
           </button>
           <button 
              onClick={() => setFilterStatus('EXPIRED')}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filterStatus === 'EXPIRED' ? 'bg-red-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700'}`}
           >
              Hết hạn
           </button>
           <button onClick={fetchData} className="p-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors" title="Làm mới"><RefreshCcw size={18}/></button>
        </div>
      </div>

      {/* 4. Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-4 w-64">Thuốc / Vật tư</th>
                <th className="p-4 w-32">Số Lô</th>
                <th className="p-4 w-32">Hạn Sử Dụng</th>
                <th className="p-4 w-32 text-right">Tồn Kho</th>
                <th className="p-4 w-40 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                 <tr><td colSpan={5} className="p-10 text-center text-slate-400 animate-pulse">Đang tải dữ liệu kho...</td></tr>
              ) : filteredBatches.length === 0 ? (
                 <tr><td colSpan={5} className="p-10 text-center text-slate-400">Không tìm thấy lô thuốc nào phù hợp.</td></tr>
              ) : (
                filteredBatches.map(batch => (
                  <tr key={batch.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                       <div>
                          <p className="font-bold text-slate-800 text-base">{batch.drugName}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5 group-hover:text-teal-600 transition-colors">{batch.drugCode}</p>
                       </div>
                    </td>
                    <td className="p-4">
                        <span className="font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">
                            {batch.batchNumber}
                        </span>
                    </td>
                    <td className="p-4 text-slate-700">{new Date(batch.expiryDate).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 text-right">
                        <span className={`font-bold text-lg ${batch.quantityOnHand < 50 ? 'text-orange-600' : 'text-slate-800'}`}>
                            {batch.quantityOnHand.toLocaleString()}
                        </span>
                    </td>
                    <td className="p-4 text-center">
                        {getExpiryStatus(batch.expiryDate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
            <span>Hiển thị {filteredBatches.length} kết quả</span>
            {/* Nếu có phân trang backend thì thêm component Pagination ở đây */}
        </div>
      </div>

    </div>
  );
};

export default PharmacyInventoryPage;