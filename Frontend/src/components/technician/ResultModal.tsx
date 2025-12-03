import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import type { PendingItem } from '@/types/Technician';
import { technicianService } from '@/services/technicianService';

interface Props {
  item: PendingItem;
  onClose: () => void;
  onSuccess: () => void;
}

const ResultModal = ({ item, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  // State cho LAB (Thêm refLow, refHigh)
  const [labData, setLabData] = useState({
    resultValue: '',
    unit: '',
    refLow: '',  // Mới
    refHigh: '', // Mới
    abnormalFlag: 'N',
  });

  // State cho IMAGING
  const [imgData, setImgData] = useState({
    description: '',
    conclusion: '',
    pacsStudyUid: '',
    viewerUrl: ''
  });

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        if (item.itemType === 'LAB_TEST' || item.itemType === 'LAB') {
            await technicianService.submitLabResult(item.id, {
                // Ưu tiên lấy tên Lab Test cụ thể, nếu không thì lấy tên Service
                parameterName: item.labTestName || item.serviceItemName,
                resultValue: labData.resultValue,
                unit: labData.unit,
                refLow: labData.refLow,   // Gửi thêm
                refHigh: labData.refHigh, // Gửi thêm
                abnormalFlag: labData.abnormalFlag,
                validatedBy: user?.staffId // Hoặc staffId
            });
        } else {
            await technicianService.submitImagingResult(item.id, {
                reportText: imgData.description,
                impression: imgData.conclusion,
                pacsStudyUid: imgData.pacsStudyUid,
                viewerUrl: imgData.viewerUrl,
                radiologistId: user?.staffId
            });
        }
        
        toast.success('Đã trả kết quả thành công!');
        onSuccess();
    } catch (error) {
        console.error(error);
        toast.error('Lỗi lưu kết quả');
    } finally {
        setLoading(false);
    }
  };

  const isLab = item.itemType === 'LAB_TEST' || item.itemType === 'LAB';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 rounded-t-2xl">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Nhập kết quả</h3>
                <p className="text-sm text-blue-600 font-medium">
                    {/* Hiển thị tên cụ thể nếu có */}
                    {item.labTestName || item.imagingProcedureName || item.serviceItemName}
                </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
        </div>

        {/* Body Scrollable */}
        <div className="p-6 overflow-y-auto">
            <form id="result-form" onSubmit={handleSubmit} className="space-y-5">
                
                {/* --- FORM XÉT NGHIỆM --- */}
                {isLab && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kết quả</label>
                                <input type="text" required autoFocus
                                    className="w-full p-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                                    placeholder="VD: 5.5"
                                    value={labData.resultValue}
                                    onChange={e => setLabData({...labData, resultValue: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Đơn vị</label>
                                <input type="text"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                    placeholder="VD: mmol/L"
                                    value={labData.unit}
                                    onChange={e => setLabData({...labData, unit: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Phần thêm: Ngưỡng tham chiếu */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Khoảng tham chiếu (Min - Max)</label>
                            <div className="flex items-center gap-2">
                                <input type="text" className="flex-1 p-2 border rounded text-sm text-center" 
                                    placeholder="Thấp (Low)"
                                    value={labData.refLow} onChange={e => setLabData({...labData, refLow: e.target.value})} />
                                <span className="text-gray-400">-</span>
                                <input type="text" className="flex-1 p-2 border rounded text-sm text-center" 
                                    placeholder="Cao (High)"
                                    value={labData.refHigh} onChange={e => setLabData({...labData, refHigh: e.target.value})} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Đánh giá bất thường</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-green-50 px-3 py-2 rounded border border-green-100">
                                    <input type="radio" name="flag" value="N" checked={labData.abnormalFlag === 'N'} onChange={e => setLabData({...labData, abnormalFlag: e.target.value})}/>
                                    <span className="text-sm text-green-700 font-bold">Bình thường</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-red-50 px-3 py-2 rounded border border-red-100">
                                    <input type="radio" name="flag" value="H" checked={labData.abnormalFlag === 'H'} onChange={e => setLabData({...labData, abnormalFlag: e.target.value})}/>
                                    <span className="text-sm text-red-600 font-bold">Cao (H)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-orange-50 px-3 py-2 rounded border border-orange-100">
                                    <input type="radio" name="flag" value="L" checked={labData.abnormalFlag === 'L'} onChange={e => setLabData({...labData, abnormalFlag: e.target.value})}/>
                                    <span className="text-sm text-orange-600 font-bold">Thấp (L)</span>
                                </label>
                            </div>
                        </div>
                    </>
                )}

                {/* --- FORM CĐHA --- */}
                {!isLab && (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mô tả hình ảnh</label>
                            <textarea rows={5} required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                placeholder="Mô tả tổn thương..."
                                value={imgData.description}
                                onChange={e => setImgData({...imgData, description: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kết luận</label>
                            <textarea rows={2} required
                                className="w-full p-3 border border-purple-200 bg-purple-50 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-bold text-gray-800"
                                placeholder="Kết luận cuối cùng..."
                                value={imgData.conclusion}
                                onChange={e => setImgData({...imgData, conclusion: e.target.value})}
                            />
                        </div>
                        {/* Phần thêm: Link PACS */}
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">PACS Study UID</label>
                                <input type="text" className="w-full p-2 border rounded text-sm" 
                                    value={imgData.pacsStudyUid} onChange={e => setImgData({...imgData, pacsStudyUid: e.target.value})} />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Link Viewer</label>
                                <input type="text" className="w-full p-2 border rounded text-sm" 
                                    value={imgData.viewerUrl} onChange={e => setImgData({...imgData, viewerUrl: e.target.value})} />
                             </div>
                        </div>
                    </>
                )}
            </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition">Hủy</button>
            <button type="submit" form="result-form" disabled={loading} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2 transition">
                {loading ? 'Đang lưu...' : <><Save size={18}/> Trả kết quả</>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;