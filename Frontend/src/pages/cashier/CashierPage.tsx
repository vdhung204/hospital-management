import { useState } from 'react';
import { Search, DollarSign, Printer, CreditCard, CheckCircle, User, FileText, ShieldCheck, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { billingService } from '@/services/billingService';
import type { InvoiceDetail, InvoiceLine } from '@/types/Billing';
// Hàm gộp các dịch vụ giống nhau
const groupInvoiceLines = (lines: InvoiceLine[]) => {
    const groupedMap = new Map();

    lines.forEach(line => {
        const key = line.serviceItemId; // Dùng ID dịch vụ làm khóa

        if (groupedMap.has(key)) {
            // Nếu đã có -> Cộng dồn các chỉ số
            const existing = groupedMap.get(key);
            existing.quantity += line.quantity;
            existing.lineAmount += line.lineAmount;
            existing.insuranceAmount += line.insuranceAmount;
            existing.patientAmount += line.patientAmount;
            
            // Cộng dồn 2 trường mới (nếu có)
            if (line.patientCopayAmount) {
                existing.patientCopayAmount = (existing.patientCopayAmount || 0) + line.patientCopayAmount;
            }
            if (line.extraChargeAmount) {
                existing.extraChargeAmount = (existing.extraChargeAmount || 0) + line.extraChargeAmount;
            }
        } else {
            groupedMap.set(key, { ...line });
        }
    });

    return Array.from(groupedMap.values());
};

const CashierPage = () => {
  const [searchId, setSearchId] = useState(''); // ID ca khám
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [useInsurance,setUseInsurance] = useState(false);
  
  // Form thanh toán
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  // 1. Tìm kiếm & Tạo hóa đơn tự động
  const handleSearch = async () => {
    if (!searchId) return;
    setLoading(true);
    setInvoice(null);
    try {
        // Bước 1: Kiểm tra xem ca khám này đã có hóa đơn chưa
        const existingInvoices = await billingService.getInvoicesByEncounter(Number(searchId));
        
        if (existingInvoices.length > 0) {
            const oldInvoice = existingInvoices[0];
            setInvoice(oldInvoice);
            updatePaymentState(oldInvoice);
            
            // Tự động detect xem hóa đơn cũ có dùng BH không để update checkbox
            if (oldInvoice.totalInsuranceAmount > 0) setUseInsurance(true);
            else setUseInsurance(false);
        } else {
            // Nếu chưa có -> Tạo tự động (Quét hết dịch vụ ra tính tiền)
            const newInvoice = await billingService.createAutoInvoice(Number(searchId), useInsurance);
            setInvoice(newInvoice);
            updatePaymentState(newInvoice);
            if (useInsurance && newInvoice.totalInsuranceAmount === 0) {
                toast.warning('Đã chọn BHYT nhưng không được chi trả (Có thể do trái tuyến/hết hạn hoặc chưa cấu hình giá)');
            } else {
                toast.success(`Đã tạo hóa đơn (${useInsurance ? 'BHYT' : 'Dịch vụ'})`);
            }
        }
    } catch (error) {
        console.error(error);
        toast.error('Không tìm thấy ca khám hoặc lỗi tạo hóa đơn');
    } finally {
        setLoading(false);
    }
  };

  // 2. Xử lý Thanh toán
  const handlePay = async () => {
    if (!invoice) return;
    if (paymentAmount <= 0) {
        toast.warning('Số tiền thanh toán phải lớn hơn 0');
        return;
    }
    
    if (!window.confirm(`Xác nhận thu ${paymentAmount.toLocaleString()} VNĐ?`)) return;

    try {
        const updatedInvoice = await billingService.addPayment(invoice.id, {
            amount: paymentAmount,
            method: paymentMethod
        });
        
        setInvoice(updatedInvoice);
        updatePaymentState(updatedInvoice);
        toast.success('Thanh toán thành công!');

    } catch (error) {
        console.log(error);
        toast.error('Lỗi thanh toán');
    }
  };

  const handleRecalculate = async () =>{
    if(!invoice || invoice.status !== 'DRAFT' ){
        toast.error('Chỉ có thể tính lại hóa đơn chưa thanh toán!');
        return;
    }
    if(!window.confirm('Xác nhận hủy hóa đơn để tính lại?')) return;
    setLoading(true);
    try{
        await billingService.deleteInvoice(invoice.id);
        const newInvoice = await billingService.createAutoInvoice(Number(searchId),useInsurance);
        setInvoice(newInvoice);
        updatePaymentState(newInvoice);
        toast.success('Cập nhật hóa đơn thành công!');
    }catch(e){
        console.log(e);
        toast.error('Lỗi!');
    }finally{
        setLoading(false);
    }
  }

  // Helper update số tiền cần thu
  const updatePaymentState = (inv: InvoiceDetail) => {
      const paid = inv.payments ? inv.payments.reduce((sum, p) => sum + p.amount, 0) : 0;
      // Remaining = Net Amount - Paid
      const remain = inv.netAmount - paid;
      setPaymentAmount(remain > 0 ? remain : 0);
  };

  // Tính toán hiển thị
  const totalPaid = invoice ? invoice.payments.reduce((acc, cur) => acc + cur.amount, 0) : 0;
  const remaining = invoice ? invoice.netAmount -  totalPaid : 0;
  const groupedLines = invoice ? groupInvoiceLines(invoice.lines) : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <DollarSign className="text-green-600"/> Thu ngân & Viện phí
      </h1>

      {/* THANH TÌM KIẾM */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex gap-4 items-end">
          <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Mã hồ sơ / Mã lượt khám</label>
              <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20}/>
                  <input 
                    type="number" 
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-lg"
                    placeholder="Nhập ID (VD: 20)..."
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
              </div>
          </div>
          {/* Checkbox BHYT */}
          <div className="pb-1">
             <label className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-all select-none ${
                 useInsurance ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'bg-gray-50 border-gray-200 text-gray-600'
             }`}>
                 <input type="checkbox" className="w-5 h-5 rounded focus:ring-blue-500"
                    checked={useInsurance} onChange={e => setUseInsurance(e.target.checked)}
                 />
                 <span className="flex items-center gap-2"><ShieldCheck size={18}/> Áp dụng BHYT</span>
             </label>
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95 h-[46px]"
          >
             {loading ? 'Đang tìm...' : 'Kiểm tra viện phí'}
          </button>
      </div>

      {/* KHU VỰC HÓA ĐƠN */}
      {invoice ? (
          <div className="flex gap-6 items-start">
              {/* CỘT TRÁI: CHI TIẾT DỊCH VỤ */}
              <div className="flex-[2] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b bg-gray-50 flex justify-between">
                      <div>
                          <h3 className="font-bold text-lg text-gray-800">Hóa đơn #{invoice.id}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                              <User size={14}/> {invoice.patientName} 
                              <span className="bg-blue-100 text-blue-800 px-2 rounded text-xs">{invoice.patientCode}</span>
                          </p>
                      </div>
                      {/* <div className={`px-3 py-1 rounded-full text-sm font-bold h-fit ${
                          invoice.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                          invoice.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                          {invoice.status === 'PAID' ? 'ĐÃ THANH TOÁN' : invoice.status === 'PARTIAL' ? 'THANH TOÁN 1 PHẦN' : 'CHƯA THANH TOÁN'}
                      </div> */}
                      <div className="flex items-center gap-3">
                          {/* Nút Tính lại (Chỉ hiện khi DRAFT) */}
                          {invoice.status === 'DRAFT' && (
                              <button onClick={handleRecalculate} className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors">
                                  <RefreshCw size={16}/> Tính lại
                              </button>
                          )}
                          
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                              invoice.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                              invoice.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                              {invoice.status === 'PAID' ? 'ĐÃ THANH TOÁN' : invoice.status === 'PARTIAL' ? 'THANH TOÁN 1 PHẦN' : 'CHƯA THANH TOÁN'}
                          </div>
                      </div>
                  </div>

                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase font-bold text-xs">
                        <tr>
                            <th className="px-4 py-3">Dịch vụ</th>
                            <th className="px-4 py-3 text-center">SL</th>
                            <th className="px-4 py-3 text-right">Đơn giá (DV)</th>
                            
                            {/* Cột Bảo hiểm */}
                            <th className="px-4 py-3 text-right text-blue-600">BH Trả</th>
                            
                            {/* Cột Chi tiết BN Trả */}
                            <th className="px-4 py-3 text-right text-gray-500">Đồng chi trả</th>
                            <th className="px-4 py-3 text-right text-gray-500">Phụ thu</th>
                            
                            {/* Cột Tổng BN Trả */}
                            <th className="px-4 py-3 text-right text-green-700">Thực thu BN</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {/* Lưu ý: Nên dùng biến 'groupedLines' nếu bạn đã gộp dòng như bài trước, hoặc dùng 'invoice.lines' */}
                        {groupedLines.map((line) => (
                            <tr key={line.id} className="hover:bg-gray-50">
                                {/* Tên dịch vụ */}
                                <td className="px-4 py-3 font-medium text-gray-700">
                                    {line.serviceItemName}
                                    {/* Hiển thị thêm badge nếu có giá BHYT khác giá DV */}
                                    {line.extraChargeAmount && line.extraChargeAmount > 0 ? (
                                    <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200">
                                        Dịch vụ
                                    </span>
                                    ) : null}
                                </td>

                                {/* Số lượng */}
                                <td className="px-4 py-3 text-center font-bold">{line.quantity}</td>

                                {/* Đơn giá gốc (CASH) */}
                                <td className="px-4 py-3 text-right text-gray-600">
                                    {line.unitPrice.toLocaleString()}
                                </td>

                                {/* Tiền BH Trả */}
                                <td className="px-4 py-3 text-right text-blue-600 font-medium">
                                    {line.insuranceAmount > 0 ? line.insuranceAmount.toLocaleString() : '0'}
                                </td>

                                {/* Phần Đồng chi trả (20%) */}
                                <td className="px-4 py-3 text-right text-gray-500 text-xs">
                                    {line.patientCopayAmount && line.patientCopayAmount > 0 
                                        ? line.patientCopayAmount.toLocaleString() 
                                        : '0'}
                                </td>

                                {/* Phần Phụ thu chênh lệch */}
                                <td className="px-4 py-3 text-right text-gray-500 text-xs">
                                    {line.extraChargeAmount && line.extraChargeAmount > 0 
                                        ? line.extraChargeAmount.toLocaleString() 
                                        : '0'}
                                </td>

                                {/* Tổng tiền BN phải trả cho dòng này */}
                                <td className="px-4 py-3 text-right font-bold text-green-700 text-base">
                                    {line.patientAmount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    
                    {/* FOOTER TỔNG KẾT */}
                    <tfoot className="bg-gray-50 font-bold text-gray-800 border-t-2 border-gray-200">
                        <tr>
                            <td colSpan={3} className="px-4 py-3 text-right uppercase text-xs text-gray-500">
                                Tổng cộng:
                            </td>
                            
                            {/* Tổng BH Trả */}
                            <td className="px-4 py-3 text-right text-blue-600">
                                {invoice.totalInsuranceAmount.toLocaleString()}
                            </td>
                            
                            {/* Tổng Đồng chi trả */}
                            <td className="px-4 py-3 text-right text-gray-500 text-xs">
                                {invoice.totalPatientCopayAmount?.toLocaleString() || 0}
                            </td>
                            
                            {/* Tổng Phụ thu */}
                            <td className="px-4 py-3 text-right text-gray-500 text-xs">
                                {invoice.totalExtraChargeAmount?.toLocaleString() || 0}
                            </td>
                            
                            {/* Tổng Thuần (Net Amount) */}
                            <td className="px-4 py-3 text-right text-lg text-green-700">
                                {invoice.netAmount.toLocaleString()} VNĐ
                            </td>
                        </tr>
                    </tfoot>
                </table>
              </div>

              {/* CỘT PHẢI: THANH TOÁN */}
              <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5 sticky top-4">
                  <div>
                      <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><CreditCard size={20}/> Thông tin thanh toán</h3>
                      
                      <div className="space-y-3 text-sm mb-6">
                          <div className="flex justify-between text-gray-500">
                              <span>Tổng phải thu:</span>
                              <span className="font-bold text-gray-800">{invoice.totalPatientAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                              <span>Đã thanh toán:</span>
                              <span className="font-bold text-green-600">-{totalPaid.toLocaleString()}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between text-lg font-bold text-red-600">
                              <span>Còn lại:</span>
                              <span>{remaining.toLocaleString()} VNĐ</span>
                          </div>
                      </div>
                  </div>

                  {remaining > 0 ? (
                      <div className="space-y-4 bg-green-50 p-4 rounded-xl border border-green-100">
                          <div>
                              <label className="block text-xs font-bold text-green-800 uppercase mb-1">Số tiền thu</label>
                              <input 
                                type="number" 
                                className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-bold text-lg text-green-900"
                                value={paymentAmount}
                                onChange={e => setPaymentAmount(Number(e.target.value))}
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-green-800 uppercase mb-1">Hình thức</label>
                              <select 
                                className="w-full p-2.5 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                value={paymentMethod}
                                onChange={e => setPaymentMethod(e.target.value)}
                              >
                                  <option value="CASH">Tiền mặt</option>
                                  <option value="TRANSFER">Chuyển khoản</option>
                                  <option value="CARD">Thẻ tín dụng</option>
                              </select>
                          </div>
                          <button 
                            onClick={handlePay}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-all active:scale-95 flex justify-center gap-2"
                          >
                              <CheckCircle size={20}/> Xác nhận Thu tiền
                          </button>
                      </div>
                  ) : (
                      <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100 text-green-700">
                          <CheckCircle size={48} className="mx-auto mb-2"/>
                          <span className="font-bold text-lg">Đã thanh toán đủ</span>
                      </div>
                  )}

                  <button className="w-full py-2 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 flex justify-center gap-2">
                      <Printer size={18}/> In hóa đơn
                  </button>
              </div>
          </div>
      ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <FileText size={64} className="opacity-20 mb-4"/>
              <p>Nhập mã lượt khám (Encounter ID) để tính tiền</p>
          </div>
      )}
    </div>
  );
};

export default CashierPage;