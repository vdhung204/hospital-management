/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
theme: {
    extend: {
      colors: {
        // Đây là màu chủ đạo (Ví dụ: Xanh dương hiện đại)
        // Bạn có thể đổi mã HEX này sang màu tím pastel bạn thích nếu muốn (#9b5de5)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6', // Màu chính
          600: '#2563eb', // Màu khi hover
          700: '#1d4ed8', // Màu đậm hơn
        },
        // Màu phụ trợ (Ví dụ: Xanh ngọc cho các thông báo thành công)
        secondary: '#10b981', 
      },
      fontFamily: {
        // Thêm font đẹp hơn font mặc định (nên cài Google Font 'Inter' hoặc 'Nunito')
        sans: ['Inter', 'sans-serif'], 
      },
      animation: {
        // Định nghĩa hiệu ứng fade-in nhẹ nhàng
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
