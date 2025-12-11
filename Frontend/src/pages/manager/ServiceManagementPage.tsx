
import { useEffect, useState, useMemo } from 'react';
import { 
    Plus, Search, Edit2, Settings, DollarSign, 
    Filter, RotateCcw, FlaskConical, Image as ImageIcon, Pill, Stethoscope
} from 'lucide-react';
import { toast } from 'react-toastify';
import { serviceItemService } from '@/services/serviceItemService';
import { drugService } from '@/services/drugService'; 
import { labService } from '@/services/labService'; 
import { imagingService } from '@/services/imagingService';
import type { ServiceItem } from '@/types/service';

const ServiceManagementPage = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  
  // Filter State
  const [filters, setFilters] = useState({ keyword: '', type: '', status: 'active' });

  // Modal States
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTariffModal, setShowTariffModal] = useState(false);

  // Data States for Creating/Editing
  const [currentItem, setCurrentItem] = useState<ServiceItem| null>(null); 
  const [baseForm, setBaseForm] = useState({ code: '', name: '', serviceType: 'CONSULT', departmentId: 0 });
  
  const [detailForm, setDetailForm] = useState({
      activeIngredient: '', usageUnit: 'Viên', form: '', strength: '', // Drug
      specimenType: 'Máu', // Lab
      modality: 'X-Ray' // Imaging
  });

  const [tariffForm, setTariffForm] = useState({ cash: 0, insurance: 0 });

  useEffect(() => { loadData() }, []);

  const loadData = async () => {
      try {
          const res = await serviceItemService.getAll();
          setServices(res);
      } catch (e) { console.error(e) } 
      finally { 
        console.log('hehe')
       }
  };

  // --- FILTER LOGIC ---
  const filteredServices = useMemo(() => {
      return services.filter(item => {
          const matchKey = item.name.toLowerCase().includes(filters.keyword.toLowerCase()) || 
                           item.code.toLowerCase().includes(filters.keyword.toLowerCase());
          
          const matchType = filters.type ? item.serviceType === filters.type : true;
          
          const matchStatus = filters.status === 'all' ? true : 
                              filters.status === 'active' ? item.isActive !== false : item.isActive === false;

          return matchKey && matchType && matchStatus;
      });
  }, [services, filters]);

  // --- HANDLERS ---
  
  // 1. Mở Modal Thêm mới
  const handleOpenCreate = () => {
      setCurrentItem(null);
      setBaseForm({ code: '', name: '', serviceType: 'CONSULT', departmentId: 0 });
      setDetailForm({ activeIngredient: '', usageUnit: 'Viên', form: '', strength: '', specimenType: 'Máu', modality: 'X-Ray' });
      setTariffForm({ cash: 0, insurance: 0 });
      setShowBaseModal(true);
  };

  // 2. Mở Modal Sửa (Chỉ sửa giá hoặc thông tin cơ bản, chi tiết phức tạp bỏ qua trong demo này)
  const handleOpenEdit = async (item: ServiceItem) => {
      setCurrentItem(item);
      setBaseForm({ 
          code: item.code, name: item.name, 
          serviceType: item.serviceType, departmentId: item.departmentId || 0 
      });
      
      // Load giá hiện tại
      try {
          const tariffs = await serviceItemService.getTariffs(item.id);
          const cash = tariffs.find((t) => t.payerType === 'CASH')?.price || 0;
          const ins = tariffs.find((t) => t.payerType === 'INSURANCE')?.price || 0;
          setTariffForm({ cash, insurance: ins });
      } catch (e) { setTariffForm({ cash: 0, insurance: 0 });console.log(e); }

      setShowBaseModal(true); // Mở modal base để sửa tên/giá
  };

  // 3. Toggle Status
  const handleToggleStatus = async () => {
      toast.warn("Chức năng này đang được phát triển!");
    //   try {
    //       // Giả sử có API toggle, nếu chưa có thì dùng update
    //       await serviceItemService.update(item.id, { ...item, isActive: !item.isActive });
    //       toast.success('Cập nhật trạng thái thành công');
    //       loadData();
    //   } catch (e) { toast.error('Lỗi cập nhật'); }
  };

  // --- QUY TRÌNH TẠO MỚI / CẬP NHẬT ---

  // B1: Lưu Base Info
  const handleSaveBase = async () => {
      try {
          let savedItem;
          const payload = { ...baseForm, departmentId: Number(baseForm.departmentId) || undefined };

          if (currentItem?.id) {
              // Update
              savedItem = await serviceItemService.update(currentItem.id, payload);
              toast.success('Đã cập nhật thông tin chung');
          } else {
              // Create
              savedItem = await serviceItemService.create(payload);
              toast.success('Đã tạo dịch vụ gốc');
          }
          
          setCurrentItem(savedItem);
          setShowBaseModal(false);

          // Điều hướng tiếp theo
          if (currentItem?.id) {
              // Nếu đang sửa -> Nhảy sang sửa giá luôn
              setShowTariffModal(true);
          } else {
              // Nếu đang tạo mới -> Đi theo quy trình
              if (['DRUG', 'LAB', 'IMG'].includes(savedItem.serviceType)) {
                  setShowDetailModal(true);
              } else {
                  setShowTariffModal(true);
              }
          }
      } catch (e) { toast.error('Lỗi lưu dịch vụ');console.log(e); }
  };

  // B2: Lưu Chi tiết
  const handleSaveDetail = async () => {
    if (!currentItem) return;
      try {
          const commonPayload = { serviceItemId: currentItem.id, code: currentItem.code, name: currentItem.name };

          if (currentItem.serviceType === 'DRUG') {
              await drugService.create({ ...commonPayload, ...detailForm } );
          } else if (currentItem.serviceType === 'LAB') {
              await labService.create({ ...commonPayload, specimenType: detailForm.specimenType });
          } else if (currentItem.serviceType === 'IMG') {
              await imagingService.create({ ...commonPayload, modality: detailForm.modality });
          }

          toast.success('Đã lưu chi tiết');
          setShowDetailModal(false);
          setShowTariffModal(true);
      } catch (e) { toast.error('Lỗi lưu chi tiết');console.log(e); }
  };

  // B3: Lưu Giá
  const handleSaveTariff = async () => {
    if (!currentItem) return;
      try {
          const today = new Date().toISOString().split('T')[0];
          // Lưu CASH
          if (tariffForm.cash >= 0) {
              await serviceItemService.addTariff(currentItem.id, { payerType: 'CASH', price: tariffForm.cash, effectiveFrom: today });
          }
          // Lưu INSURANCE
          if (tariffForm.insurance >= 0) {
              await serviceItemService.addTariff(currentItem.id, { payerType: 'INSURANCE', price: tariffForm.insurance, effectiveFrom: today });
          }
          
          toast.success('Hoàn tất!');
          setShowTariffModal(false);
          loadData();
      } catch (e) { toast.error('Lỗi lưu giá');console.log(e); }
  };

  // Helper render icon loại
  const getTypeIcon = (type: string) => {
      switch(type) {
          case 'DRUG': return <Pill size={16} className="text-green-600"/>;
          case 'LAB': return <FlaskConical size={16} className="text-blue-600"/>;
          case 'IMG': return <ImageIcon size={16} className="text-purple-600"/>;
          default: return <Stethoscope size={16} className="text-orange-600"/>;
      }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
          <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Settings className="text-blue-600"/> Quản lý Dịch vụ & Giá
              </h1>
              <p className="text-slate-500 text-sm">Danh mục toàn bộ dịch vụ kỹ thuật, thuốc và vật tư</p>
          </div>
          <button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-transform">
              <Plus size={20}/> Thêm mới
          </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
              <label className="text-xs font-bold text-slate-500 ml-1">Tìm kiếm</label>
              <div className="relative mt-1">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                  <input type="text" placeholder="Tên dịch vụ, Mã..." 
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={filters.keyword} onChange={e => setFilters({...filters, keyword: e.target.value})} />
              </div>
          </div>
          <div className="md:col-span-3">
              <label className="text-xs font-bold text-slate-500 ml-1">Loại dịch vụ</label>
              <select className="w-full mt-1 py-2 px-3 border rounded-lg bg-white outline-none"
                  value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
                  <option value="">Tất cả</option>
                  <option value="CONSULT">Khám bệnh</option>
                  <option value="LAB">Xét nghiệm</option>
                  <option value="IMG">Chẩn đoán hình ảnh</option>
                  <option value="DRUG">Thuốc / Vật tư</option>
              </select>
          </div>
          <div className="md:col-span-3">
              <label className="text-xs font-bold text-slate-500 ml-1">Trạng thái</label>
              <select className="w-full mt-1 py-2 px-3 border rounded-lg bg-white outline-none"
                  value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
                  <option value="all">Tất cả</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Đã ngừng</option>
              </select>
          </div>
          <div className="md:col-span-1">
              <button onClick={() => setFilters({keyword: '', type: '', status: 'all'})} className="w-full py-2 px-3 border rounded-lg text-slate-500 hover:bg-slate-50">
                  <RotateCcw size={18} className="mx-auto"/>
              </button>
          </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                  <tr>
                      <th className="px-6 py-4">Mã DV</th>
                      <th className="px-6 py-4">Tên Dịch vụ</th>
                      <th className="px-6 py-4">Phân loại</th>
                      <th className="px-6 py-4 text-right">Giá tham khảo</th>
                      <th className="px-6 py-4 text-center">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {filteredServices.length > 0 ? filteredServices.map(item => (
                      <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${item.isActive === false ? 'opacity-60 bg-gray-50' : ''}`}>
                          <td className="px-6 py-4 font-mono text-blue-700 font-bold text-sm">{item.code}</td>
                          <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                          <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  {getTypeIcon(item.serviceType)}
                                  {item.serviceType}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {/* Logic hiển thị giá: Lọc từ mảng tariffs trả về */}
                            {(() => {
                                // Tìm giá CASH
                                const cashPrice = item.tariffs?.find((t) => t.payerType === 'CASH')?.price;
                                // Tìm giá BHYT
                                const insurancePrice = item.tariffs?.find((t) => t.payerType === 'INSURANCE')?.price;

                                // Nếu chưa có giá nào
                                if (!cashPrice && !insurancePrice) {
                                    return <span className="text-xs text-gray-400 italic">Chưa thiết lập</span>;
                                }

                                return (
                                    <div className="flex flex-col items-end gap-0.5">
                                        {/* Dòng giá Dịch vụ */}
                                        {cashPrice ? (
                                            <div className="text-sm font-bold text-gray-700">
                                                {cashPrice.toLocaleString('vi-VN')} 
                                                <span className="text-[10px] text-gray-400 ml-1 font-normal">DV</span>
                                            </div>
                                        ) : null}

                                        {/* Dòng giá Bảo hiểm */}
                                        {insurancePrice ? (
                                            <div className="text-xs font-bold text-blue-600">
                                                {insurancePrice.toLocaleString('vi-VN')} 
                                                <span className="text-[10px] text-blue-400 ml-1 font-normal">BH</span>
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })()}
                        </td>
                          <td className="px-6 py-4 text-center">
                              <button onClick={() => handleToggleStatus()}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.isActive !== false ? 'bg-green-500' : 'bg-gray-300'}`}>
                                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${item.isActive !== false ? 'translate-x-5' : 'translate-x-1'}`} />
                              </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                              <button onClick={() => handleOpenEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                  <Edit2 size={18}/>
                              </button>
                          </td>
                      </tr>
                  )) : (
                      <tr>
                          <td colSpan={6} className="p-10 text-center text-slate-400 text-sm">
                              <Filter size={32} className="mx-auto mb-2 opacity-20"/> Không tìm thấy dịch vụ nào.
                          </td>
                      </tr>
                  )}
              </tbody>
          </table>
      </div>

      {/* --- MODAL 1: BASE INFO --- */}
      {showBaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl">
                  <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">
                      {currentItem ? 'Cập nhật Dịch vụ' : 'Bước 1: Thông tin chung'}
                  </h3>
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Mã Dịch vụ</label>
                              <input className="w-full p-2.5 border rounded-lg font-mono uppercase" 
                                  value={baseForm.code} onChange={e => setBaseForm({...baseForm, code: e.target.value.toUpperCase()})} />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Loại hình</label>
                              <select className="w-full p-2.5 border rounded-lg bg-white" 
                                  value={baseForm.serviceType} onChange={e => setBaseForm({...baseForm, serviceType: e.target.value})}
                                  disabled={!!currentItem} // Không cho sửa loại khi update
                              >
                                  <option value="CONSULT">Khám bệnh</option>
                                  <option value="DRUG">Thuốc</option>
                                  <option value="LAB">Xét nghiệm</option>
                                  <option value="IMG">Chẩn đoán hình ảnh</option>
                                  <option value="OTHER">Khác</option>
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Tên hiển thị</label>
                          <input className="w-full p-2.5 border rounded-lg" 
                              value={baseForm.name} onChange={e => setBaseForm({...baseForm, name: e.target.value})} />
                      </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                      <button onClick={() => setShowBaseModal(false)} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">Hủy</button>
                      <button onClick={handleSaveBase} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
                          {currentItem ? 'Lưu & Sửa giá' : 'Tiếp tục'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* --- MODAL 2: DETAIL --- */}
      {showDetailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl">
                  <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Bước 2: Chi tiết chuyên môn</h3>
                  <div className="space-y-4">
                      {currentItem?.serviceType === 'DRUG' && (
                        <div className="space-y-3">
                            {/* --- TRƯỜNG HOẠT CHẤT --- */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Hoạt chất chính</label>
                                <input 
                                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500" 
                                    placeholder="VD: Paracetamol, Ibuprofen..." 
                                    value={detailForm.activeIngredient} 
                                    onChange={e => setDetailForm({...detailForm, activeIngredient: e.target.value})} 
                                />
                            </div>

                            {/* --- CÁC TRƯỜNG CÒN LẠI (Hàm lượng, Đơn vị, Dạng bào chế) --- */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Hàm lượng</label>
                                    <input 
                                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500" 
                                        placeholder="VD: 500mg" 
                                        value={detailForm.strength} 
                                        onChange={e => setDetailForm({...detailForm, strength: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Đơn vị tính</label>
                                    <select 
                                        className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-purple-500"
                                        value={detailForm.usageUnit} 
                                        onChange={e => setDetailForm({...detailForm, usageUnit: e.target.value})}
                                    >
                                        <option value="Viên">Viên</option>
                                        <option value="Vỉ">Vỉ</option>
                                        <option value="Hộp">Hộp</option>
                                        <option value="Lọ">Lọ</option>
                                        <option value="Ống">Ống</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Dạng bào chế</label>
                                <input 
                                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500" 
                                    placeholder="VD: Viên nén bao phim..." 
                                    value={detailForm.form} 
                                    onChange={e => setDetailForm({...detailForm, form: e.target.value})} 
                                />
                            </div>
                        </div>
                      )}
                      {currentItem?.serviceType === 'LAB' && (
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Loại bệnh phẩm</label>
                              <select className="w-full p-2.5 border rounded-lg bg-white" 
                                  value={detailForm.specimenType} onChange={e => setDetailForm({...detailForm, specimenType: e.target.value})}>
                                  <option value="Máu">Máu</option>
                                  <option value="Nước tiểu">Nước tiểu</option>
                                  <option value="Dịch tễ">Dịch tễ</option>
                              </select>
                          </div>
                      )}
                      {currentItem?.serviceType === 'IMG' && (
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Loại thiết bị</label>
                              <select className="w-full p-2.5 border rounded-lg bg-white" 
                                  value={detailForm.modality} onChange={e => setDetailForm({...detailForm, modality: e.target.value})}>
                                  <option value="X-Ray">X-Quang</option>
                                  <option value="CT">CT Scan</option>
                                  <option value="MRI">MRI</option>
                                  <option value="US">Siêu âm</option>
                              </select>
                          </div>
                      )}
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                      <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">Bỏ qua</button>
                      <button onClick={handleSaveDetail} className="px-6 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700">Lưu chi tiết</button>
                  </div>
              </div>
          </div>
      )}

      {/* --- MODAL 3: TARIFF --- */}
      {showTariffModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl">
                  <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2 flex items-center gap-2">
                      <DollarSign className="text-green-600"/> {currentItem ? 'Cập nhật Giá' : 'Bước 3: Thiết lập giá'}
                  </h3>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-green-800 mb-1">Giá Dịch vụ (CASH)</label>
                          <input type="number" className="w-full p-3 border border-green-300 rounded-lg font-bold text-right text-lg text-green-900 focus:ring-2 focus:ring-green-500 outline-none" 
                              value={tariffForm.cash} onChange={e => setTariffForm({...tariffForm, cash: Number(e.target.value)})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-blue-800 mb-1">Giá Bảo hiểm (INSURANCE)</label>
                          <input type="number" className="w-full p-3 border border-blue-300 rounded-lg font-bold text-right text-lg text-blue-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                              value={tariffForm.insurance} onChange={e => setTariffForm({...tariffForm, insurance: Number(e.target.value)})} />
                      </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                      <button onClick={() => {setShowTariffModal(false); loadData();}} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">Đóng</button>
                      <button onClick={handleSaveTariff} className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700">Lưu Giá</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default ServiceManagementPage;