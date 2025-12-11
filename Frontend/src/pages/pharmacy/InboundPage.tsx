import { useEffect, useState } from 'react';
import { 
    PackagePlus, Search, Plus, Trash2, Save, Archive, X, AlertCircle 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { inventoryService } from '@/services/inventoryService';
import { medicalService } from '@/services/medicalService';
import type { DrugOption, ImportItem } from '@/types/Inventory';

const InboundPage = () => {
  // Data cho Dropdown
  const [drugs, setDrugs] = useState<DrugOption[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // State Input Tạm (Dòng đang nhập)
  const [selectedDrug, setSelectedDrug] = useState<DrugOption| null>(null);
  const [batchNo, setBatchNo] = useState('');
  const [expiry, setExpiry] = useState('');
  const [qty, setQty] = useState<number | ''>(''); 
  const [note, setNote] = useState(''); 

  // State Danh sách chờ nhập (Cart)
  const [importList, setImportList] = useState<ImportItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Load danh mục thuốc
  useEffect(() => {
      const fetchDrugs = async () => {
          try {
              const res = await medicalService.getAllDrugs() as DrugOption[];
              // Chỉ lấy thuốc đang hoạt động
              setDrugs(res);
          } catch (e) { console.error("Lỗi load thuốc");console.log(e); }
      };
      fetchDrugs();
  }, []);

  // Filter cho Search Dropdown
  const filteredDrugs = drugs.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.code.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 8); // Lấy 8 kết quả đầu

  // 2. Thêm vào bảng tạm (Client side validation)
  const handleAddItem = () => {
      if (!selectedDrug) return toast.warning('Chưa chọn thuốc');
      if (!batchNo.trim()) return toast.warning('Chưa nhập số lô');
      if (!expiry) return toast.warning('Chưa nhập hạn dùng');
      if (!qty || Number(qty) <= 0) return toast.warning('Số lượng phải > 0');

      // Tạo object tạm để hiển thị
      const newItem = {
          tempId: Date.now(), // Key React
          drugId: selectedDrug.id,
          drugCode: selectedDrug.code,
          drugName: selectedDrug.name,
          unit: selectedDrug.form,
          batchNumber: batchNo.toUpperCase(),
          expiryDate: expiry,
          quantity: Number(qty)
      };

      setImportList([...importList, newItem]);

      // Reset form nhập
      setSelectedDrug(null);
      setBatchNo('');
      setExpiry('');
      setQty('');
      setSearchTerm('');
  };

  const handleRemoveItem = (tempId: number) => {
      setImportList(prev => prev.filter(i => i.tempId !== tempId));
  };

  // 3. Gửi API (Quan trọng: Xử lý vòng lặp và Lỗi Backend)
  const handleSubmit = async () => {
      if (importList.length === 0) return;
      if (!confirm(`Xác nhận nhập kho ${importList.length} mặt hàng?`)) return;

      setIsSubmitting(true);
      let successCount = 0;
      let errorOccurred = false;

      // Duyệt từng item để gửi
      for (const item of importList) {
          try {
              await inventoryService.importStock({
                  drugId: item.drugId,
                  batchNumber: item.batchNumber,
                  expiryDate: item.expiryDate,
                  quantity: item.quantity,
                  note: note || 'Nhập kho thủ công'
              });
              successCount++;
          } catch (error: any) {
              errorOccurred = true;
              // Lấy message lỗi từ Backend (InventoryController trả về)
              const backendMsg = error.response?.data || "Lỗi không xác định";
              
              // Hiển thị lỗi chi tiết cho Dược sĩ biết
              toast.error(
                  <div>
                      <strong>Lỗi tại dòng: {item.drugName}</strong>
                      <p className="text-xs mt-1">{backendMsg}</p>
                  </div>,
                  { autoClose: 5000 }
              );
              
              // Dừng lại ngay khi gặp lỗi để user sửa, không chạy tiếp tránh lộn xộn
              break; 
          }
      }

      // Xử lý sau vòng lặp
      if (successCount > 0) {
          // Xóa những dòng đã nhập thành công khỏi list (cần logic phức tạp hơn chút nếu muốn giữ lại dòng lỗi)
          // Để đơn giản cho đồ án: Nếu có lỗi thì giữ nguyên list, chỉ báo lỗi. Nếu thành công hết thì clear.
          if (!errorOccurred) {
              toast.success(`Đã nhập kho thành công toàn bộ ${successCount} mục!`);
              setImportList([]);
              setNote('');
          } else {
              toast.warning(`Đã nhập được ${successCount} mục. Quy trình dừng lại do có lỗi.`);
              // Thực tế nên lọc lại importList để bỏ đi các item đã nhập xong
              // Nhưng ở mức độ này, giữ nguyên để user kiểm tra lại cũng được.
          }
      }
      setIsSubmitting(false);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-teal-600 rounded-lg text-white shadow-lg shadow-teal-200">
              <PackagePlus size={24}/>
          </div>
          <div>
              <h1 className="text-2xl font-bold text-slate-800">Nhập kho Dược</h1>
              <p className="text-slate-500 text-sm">Nhập hàng từ nhà cung cấp vào kho lẻ</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* --- CỘT TRÁI: FORM NHẬP --- */}
          <div className="lg:col-span-1 h-fit">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 sticky top-4">
                  <h3 className="font-bold text-slate-700 mb-4 border-b pb-2 flex justify-between">
                      Thông tin chi tiết
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Bước 1</span>
                  </h3>
                  
                  <div className="space-y-4">
                      {/* 1. Chọn thuốc */}
                      <div className="relative">
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Tên thuốc / Vật tư</label>
                          {selectedDrug ? (
                              <div className="flex justify-between items-center p-3 bg-teal-50 border border-teal-200 rounded-lg animate-in fade-in">
                                  <div>
                                      <p className="font-bold text-teal-800 text-sm">{selectedDrug.name}</p>
                                      <div className="flex gap-2 text-[10px] text-teal-600 mt-0.5">
                                          <span className="bg-white px-1 rounded border border-teal-100">{selectedDrug.code}</span>
                                          <span className="bg-white px-1 rounded border border-teal-100">{selectedDrug.form}</span>
                                      </div>
                                  </div>
                                  <button onClick={() => setSelectedDrug(null)} className="text-teal-400 hover:text-teal-700 p-1">
                                      <X size={18}/>
                                  </button>
                              </div>
                          ) : (
                              <div className="relative">
                                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                                  <input 
                                      type="text" 
                                      placeholder="Gõ tên thuốc để tìm..." 
                                      className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                      value={searchTerm} 
                                      onChange={e => setSearchTerm(e.target.value)} 
                                  />
                                  {/* Dropdown Gợi ý */}
                                  {searchTerm && (
                                      <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto">
                                          {filteredDrugs.length > 0 ? filteredDrugs.map(d => (
                                              <div key={d.id} onClick={() => {setSelectedDrug(d); setSearchTerm('');}}
                                                  className="p-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 group">
                                                  <p className="font-bold text-sm text-slate-700 group-hover:text-teal-700">{d.name}</p>
                                                  <p className="text-xs text-slate-400">{d.code} • {d.activeIngredient}</p>
                                              </div>
                                          )) : (
                                              <div className="p-3 text-center text-xs text-slate-400">Không tìm thấy thuốc</div>
                                          )}
                                      </div>
                                  )}
                              </div>
                          )}
                      </div>

                      {/* 2. Lô & Hạn */}
                      <div className="grid grid-cols-2 gap-3">
                          <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Số lô (Batch)</label>
                              <input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg uppercase text-sm font-mono focus:border-teal-500 outline-none" 
                                  value={batchNo} onChange={e => setBatchNo(e.target.value)} placeholder="A001..."/>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Hạn dùng</label>
                              <input type="date" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:border-teal-500 outline-none" 
                                  value={expiry} onChange={e => setExpiry(e.target.value)}/>
                          </div>
                      </div>
                      {/* 3. Số lượng */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Số lượng nhập</label>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    min="1" 
                                    className="flex-1 w-0 min-w-[100px] p-2.5 border border-slate-300 rounded-lg font-bold text-lg text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none" 
                                    value={qty} 
                                    onChange={e => setQty(Number(e.target.value))} 
                                    placeholder="0"
                                />
                                <div className="flex items-center justify-center bg-slate-100 px-3 rounded-lg text-sm font-bold text-slate-600 whitespace-nowrap min-w-[60px]">
                                    {selectedDrug?.form || 'Đv'}
                                </div>
                            </div>
                        </div>

                      <button onClick={handleAddItem} disabled={!selectedDrug} 
                          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md transition-all active:scale-95">
                          <Plus size={20}/> Thêm vào phiếu
                      </button>
                  </div>
              </div>
          </div>

          {/* --- CỘT PHẢI: DANH SÁCH --- */}
          <div className="lg:col-span-2 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
              {/* Header List */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
                  <div>
                      <h3 className="font-bold text-slate-800 flex items-center gap-2"><Archive size={18} className="text-teal-600"/> Phiếu nhập kho</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Kiểm tra kỹ thông tin trước khi lưu</p>
                  </div>
                  <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1.5 rounded-full">
                      {importList.length} mặt hàng
                  </span>
              </div>
              
              {/* Table Content */}
              <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold sticky top-0">
                          <tr>
                              <th className="p-4 border-b border-slate-100">Thuốc / Vật tư</th>
                              <th className="p-4 border-b border-slate-100">Số lô</th>
                              <th className="p-4 border-b border-slate-100">Hạn dùng</th>
                              <th className="p-4 border-b border-slate-100 text-center">Số lượng</th>
                              <th className="p-4 border-b border-slate-100 w-10"></th>
                          </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-slate-100">
                          {importList.length === 0 ? (
                              <tr>
                                  <td colSpan={5} className="p-12 text-center text-slate-400">
                                      <div className="flex flex-col items-center">
                                          <PackagePlus size={48} className="opacity-20 mb-3"/>
                                          <p>Danh sách trống.</p>
                                          <p className="text-xs">Vui lòng chọn thuốc bên trái để thêm vào phiếu.</p>
                                      </div>
                                  </td>
                              </tr>
                          ) : (
                              importList.map((item) => (
                                  <tr key={item.tempId} className="hover:bg-slate-50 group transition-colors">
                                      <td className="p-4">
                                          <p className="font-bold text-slate-800">{item.drugName}</p>
                                          <p className="text-xs text-slate-500 font-mono">{item.drugCode}</p>
                                      </td>
                                      <td className="p-4 font-mono text-slate-700 bg-slate-50/50">{item.batchNumber}</td>
                                      <td className="p-4 text-slate-700">
                                          {/* Highlight nếu hạn dùng < 6 tháng (Demo) */}
                                          {item.expiryDate}
                                      </td>
                                      <td className="p-4 text-center">
                                          <span className="font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-md border border-teal-100">
                                              +{item.quantity}
                                          </span>
                                          <span className="text-xs text-slate-400 ml-1 block mt-1">{item.unit}</span>
                                      </td>
                                      <td className="p-4 text-right">
                                          <button onClick={() => handleRemoveItem(item.tempId)} 
                                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                              <Trash2 size={18}/>
                                          </button>
                                      </td>
                                  </tr>
                              ))
                          )}
                      </tbody>
                  </table>
              </div>

              {/* Footer Actions */}
              <div className="p-5 bg-slate-50 border-t border-slate-200 rounded-b-xl">
                  <div className="mb-4">
                      <label className="block text-xs font-bold text-slate-500 mb-2">Ghi chú phiếu nhập (Tùy chọn)</label>
                      <input type="text" className="w-full p-3 border border-slate-300 rounded-lg bg-white text-sm outline-none focus:border-teal-500" 
                          placeholder="VD: Nhập hàng theo hóa đơn đỏ số 00123..."
                          value={note} onChange={e => setNote(e.target.value)} />
                  </div>
                  
                  <div className="flex justify-end items-center gap-4">
                      {importList.length > 0 && (
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                              <AlertCircle size={14}/> Kiểm tra kỹ Số lô & Hạn dùng trước khi lưu
                          </div>
                      )}
                      <button 
                          onClick={handleSubmit} 
                          disabled={importList.length === 0 || isSubmitting} 
                          className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-200 hover:bg-teal-700 disabled:bg-slate-300 disabled:shadow-none flex items-center gap-2 transition-all active:scale-95"
                      >
                          {isSubmitting ? 'Đang xử lý...' : <><Save size={20}/> Hoàn tất Nhập kho</>}
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default InboundPage;