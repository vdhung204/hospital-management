import { toast } from 'react-toastify';

export const handleError = (error: any, defaultMessage: string = 'Có lỗi xảy ra!') => {
    console.error(error);
    
    // Kiểm tra xem có phản hồi từ server không
    if (error.response) {
        // Ưu tiên lấy message từ backend
        const serverMessage = error.response.data?.message || error.response.data;
        
        // Nếu server trả về message dạng chuỗi thì hiển thị
        if (typeof serverMessage === 'string') {
            toast.error(serverMessage);
            return;
        }
    }
    
    // Nếu lỗi mạng hoặc server không trả message rõ ràng
    toast.error(defaultMessage);
};