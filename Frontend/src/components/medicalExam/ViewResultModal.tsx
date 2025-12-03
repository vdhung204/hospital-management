import { useEffect, useState } from 'react';
import { X, FileText, Image as ImageIcon, Activity } from 'lucide-react';
import { medicalService } from '@/services/medicalService';

interface Props {
  itemId: number;
  itemType: string; // LAB_TEST hoặc IMG_PROC
  itemName: string;
  onClose: () => void;
}
// Định nghĩa kiểu dữ liệu bao trùm cả Lab và Imaging
interface ResultData {
  id: number;
  validatedBy?: number;
  validatedAt?: string;
  
  // Trường của Xét nghiệm
  parameterName?: string;
  resultValue?: string;
  unit?: string;
  refLow?: string;
  refHigh?: string;
  abnormalFlag?: string;

  // Trường của CĐHA
  reportText?: string;
  impression?: string;
  radiologistId?: number;
  pacsStudyUid?: string;
  viewerUrl?: string;
}

const ViewResultModal = ({ itemId, itemType, itemName, onClose }: Props) => {
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
        try {
            let res;
            if (itemType === 'LAB_TEST') {
                res = await medicalService.getLabResults(itemId);
            } else {
                res = await medicalService.getImagingResults(itemId);
            }
            // API trả về mảng, lấy phần tử đầu tiên (hoặc hiển thị cả list nếu cần)
            setData(res && res.length > 0 ? res[0] : null);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadResult();
  }, [itemId, itemType]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 rounded-t-2xl">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Kết quả cận lâm sàng 1</h3>
                <p className="text-sm text-blue-600 font-medium">{itemName}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
            {loading ? (
                <div className="text-center py-8 text-gray-500">Đang tải kết quả...</div>
            ) : !data ? (
                <div className="text-center py-8 text-red-500 italic">Chưa tìm thấy dữ liệu kết quả</div>
            ) : (
                <div className="space-y-4">
                    {/* --- HIỂN THỊ KẾT QUẢ LAB --- */}
                    {itemType === 'LAB_TEST' && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-gray-500 font-bold uppercase">Chỉ số</span>
                                <span className="text-sm text-gray-500 font-bold uppercase">Kết quả</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">{data.parameterName}</span>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-blue-700">{data.resultValue}</span>
                                    <span className="text-sm text-gray-500 ml-1">{data.unit}</span>
                                </div>
                            </div>
                            {/* Đánh giá bất thường */}
                            {data.abnormalFlag && data.abnormalFlag !== 'N' && (
                                <div className="mt-3 pt-3 border-t border-blue-200 text-right">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                        data.abnormalFlag === 'H' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {data.abnormalFlag === 'H' ? 'Cao hơn bình thường' : 'Thấp hơn bình thường'}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- HIỂN THỊ KẾT QUẢ CĐHA --- */}
                    {itemType !== 'LAB_TEST' && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FileText size={16}/> Mô tả hình ảnh</h4>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{data.reportText}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                <h4 className="text-sm font-bold text-purple-800 mb-2 flex items-center gap-2"><Activity size={16}/> Kết luận</h4>
                                <p className="text-sm font-bold text-purple-900">{data.impression}</p>
                            </div>
                            {data.viewerUrl && (
                                <a href={data.viewerUrl} target="_blank" rel="noreferrer" 
                                   className="block w-full py-2 bg-gray-800 text-white text-center rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-2">
                                    <ImageIcon size={18}/> Xem hình ảnh (PACS)
                                </a>
                            )}
                        </div>
                    )}

                    <div className="text-xs text-gray-400 text-center mt-4 pt-4 border-t border-gray-100">
                        Xác nhận bởi: {data.validatedBy || 'Kỹ thuật viên'} • Thời gian: {data.validatedAt ? new Date(data.validatedAt).toLocaleString('vi-VN') : '--'}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ViewResultModal;