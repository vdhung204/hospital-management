import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, User, MapPin, Activity, FileText, FlaskConical, Pill, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import { encounterService } from '@/services/encounterService';

const PortalHistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
        try {
            const res = await encounterService.getDetailForPatient(Number(id));
            setData(res);
        } catch (e) {
            toast.error('Không tìm thấy hồ sơ');
            navigate('/portal/history');
        } finally {
            setLoading(false);
        }
    };
    loadDetail();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-slate-500">Đang tải hồ sơ...</div>;
  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* Header & Navigation */}
      <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition">
              <ChevronLeft size={24} className="text-slate-600"/>
          </button>
          <div>
              <h1 className="text-2xl font-bold text-slate-800">Chi tiết lượt khám</h1>
              <p className="text-slate-500 text-sm">Mã hồ sơ: <span className="font-mono font-bold">#{data.id}</span></p>
          </div>
      </div>

      {/* 1. THÔNG TIN CHUNG (Overview Card) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><Calendar size={20}/></div>
                      <div>
                          <p className="text-xs text-slate-500 font-bold uppercase">Ngày khám</p>
                          <p className="font-medium text-slate-800">{new Date(data.visitDate).toLocaleString('vi-VN')}</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center"><MapPin size={20}/></div>
                      <div>
                          <p className="text-xs text-slate-500 font-bold uppercase">Chuyên khoa</p>
                          <p className="font-medium text-slate-800">{data.department?.name}</p>
                      </div>
                  </div>
              </div>
              
              {/* Sinh hiệu */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><Activity size={16}/> Chỉ số sinh tồn</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div><span className="text-slate-500">Mạch:</span> <span className="font-bold">{data.pulse || '--'}</span> l/p</div>
                      <div><span className="text-slate-500">Nhiệt độ:</span> <span className="font-bold">{data.temperature || '--'}</span> °C</div>
                      <div><span className="text-slate-500">Huyết áp:</span> <span className="font-bold">{data.bloodPressure || '--'}</span> mmHg</div>
                      <div><span className="text-slate-500">Cân nặng:</span> <span className="font-bold">{data.weight || '--'}</span> kg</div>
                  </div>
              </div>
          </div>
      </div>

      {/* 2. CHẨN ĐOÁN (Diagnosis) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="text-orange-500"/> Chẩn đoán & Ghi chú
          </h3>
          
          <div className="space-y-4">
              {/* Danh sách bệnh */}
              {data.diagnoses?.length > 0 ? (
                  <div className="space-y-2">
                      {data.diagnoses.map((diag: any) => (
                          <div key={diag.id} className="flex items-start gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${diag.primary ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                                  {diag.primary ? 'Chính' : 'Phụ'}
                              </span>
                              <p className="text-slate-700 font-medium">
                                  <span className="font-mono text-slate-500 mr-2">{diag.icd10Code}</span>
                                  {diag.icd10Name}
                              </p>
                          </div>
                      ))}
                  </div>
              ) : <p className="text-slate-400 italic">Chưa có kết luận chẩn đoán.</p>}

              {/* Lời dặn / Ghi chú */}
              {data.notes?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-sm font-bold text-slate-500 mb-2">Ghi chú bác sĩ:</p>
                      {data.notes.map((note: any) => (
                          <div key={note.id} className="bg-yellow-50 p-3 rounded-lg text-sm text-slate-700 mb-2">
                              {note.content}
                          </div>
                      ))}
                  </div>
              )}
          </div>
      </div>

      {/* 3. ĐƠN THUỐC (Prescription) */}
      {data.prescriptions?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <Pill className="text-green-600"/> Đơn thuốc
              </h3>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                          <tr>
                              <th className="p-3 rounded-l-lg">Tên thuốc</th>
                              <th className="p-3 text-center">SL</th>
                              <th className="p-3 rounded-r-lg">Cách dùng</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {data.prescriptions[0].items.map((item: any) => (
                              <tr key={item.id}>
                                  <td className="p-3 font-medium text-slate-700">
                                      {item.drugName} <span className="text-xs text-slate-400 font-normal">({item.strength})</span>
                                  </td>
                                  <td className="p-3 text-center font-bold">{item.quantity} <span className="text-xs font-normal">{item.form || 'Viên'}</span></td>
                                  <td className="p-3 text-slate-600">{item.dose}, {item.frequency}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* 4. KẾT QUẢ CẬN LÂM SÀNG (Labs & Imaging) */}
      {data.orders?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <FlaskConical className="text-purple-600"/> Kết quả Xét nghiệm & CĐHA
              </h3>
              
              <div className="space-y-4">
                  {data.orders.map((order: any) => (
                      <div key={order.id}>
                          {order.items.map((item: any) => (
                              <div key={item.id} className="border border-slate-200 rounded-xl overflow-hidden mb-3">
                                  <div className="bg-slate-50 p-3 font-bold text-slate-700 border-b border-slate-200 flex justify-between">
                                      <span>{item.serviceItemName || item.labTestName || item.imagingProcedureName}</span>
                                      <span className={`text-xs px-2 py-1 rounded ${item.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                          {item.status}
                                      </span>
                                  </div>
                                  
                                  <div className="p-3">
                                      {/* Lab Results */}
                                      {item.labResults?.length > 0 && (
                                          <table className="w-full text-sm">
                                              <tbody>
                                                  {item.labResults.map((res: any) => (
                                                      <tr key={res.id} className="border-b border-dashed border-slate-100 last:border-0">
                                                          <td className="py-2 text-slate-600">{res.parameterName}</td>
                                                          <td className="py-2 font-bold text-right">
                                                              {res.resultValue} {res.unit}
                                                              {/* Cảnh báo chỉ số bất thường */}
                                                              {['H','L'].includes(res.abnormalFlag) && (
                                                                  <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">{res.abnormalFlag}</span>
                                                              )}
                                                          </td>
                                                      </tr>
                                                  ))}
                                              </tbody>
                                          </table>
                                      )}

                                      {/* Imaging Results */}
                                      {item.imagingResults?.length > 0 && (
                                          <div className="text-sm text-slate-700">
                                              <p><span className="font-bold">Kết luận:</span> {item.imagingResults[0].impression}</p>
                                              {item.imagingResults[0].viewerUrl && (
                                                  <a href={item.imagingResults[0].viewerUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs mt-1 block">Xem hình ảnh</a>
                                              )}
                                          </div>
                                      )}

                                      {/* Nếu chưa có kết quả */}
                                      {!item.labResults?.length && !item.imagingResults?.length && (
                                          <p className="text-xs text-slate-400 italic">Đang chờ kết quả...</p>
                                      )}
                                  </div>
                              </div>
                          ))}
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* 5. CHI PHÍ (Invoice) - Optional */}
      {data.invoices?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <DollarSign className="text-teal-600"/> Chi phí khám chữa bệnh
              </h3>
              <div className="flex justify-between items-center bg-teal-50 p-4 rounded-xl border border-teal-100">
                  <span className="text-slate-600 font-medium">Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-teal-700">
                      {data.invoices.reduce((acc: number, inv: any) => acc + inv.netAmount, 0).toLocaleString('vi-VN')} đ
                  </span>
              </div>
          </div>
      )}

    </div>
  );
};

export default PortalHistoryDetail;