import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Info, Loader2, Clock, FileText, CalendarCheck } from 'lucide-react';
import type { CurrentUserResponse } from '@/types/auth'; // Đảm bảo đường dẫn đúng
 // Đảm bảo đường dẫn đúng

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface Props {
  currentUser?: CurrentUserResponse;
}

const PatientChatPage: React.FC<Props> = ({ currentUser }) => {
  const patientName = currentUser?.patient?.fullName || currentUser?.fullName || "Bạn";
  
  // State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: `Chào ${patientName}, tôi là trợ lý AI. Tôi có thể giúp gì cho sức khỏe của bạn hôm nay?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Xử lý gửi tin
  const handleSend = (textToSend: string = input) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Giả lập API call
    setTimeout(() => {
      let botText = "Cảm ơn câu hỏi của bạn. Chúng tôi sẽ phản hồi sớm.";
      const lowerText = textToSend.toLowerCase();
      
      if(lowerText.includes("lịch")) botText = "Bạn có thể xem lịch khám tại menu 'Đặt lịch hẹn'.";
      else if (lowerText.includes("đau")) botText = "Bạn nên nghỉ ngơi và theo dõi thêm. Nếu đau kéo dài, hãy đặt lịch khám ngay.";

      const botMsg: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsThinking(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // Gợi ý câu hỏi nhanh (Suggestion Chips)
  const suggestions = [
    { icon: CalendarCheck, text: "Đặt lịch tái khám" },
    { icon: FileText, text: "Xem kết quả xét nghiệm" },
    { icon: Clock, text: "Giờ làm việc" },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tư vấn trực tuyến</h1>
        <p className="text-gray-500 text-sm">Hỏi đáp nhanh với trợ lý ảo AI</p>
      </div>

      {/* CHAT CARD CONTAINER */}
      {/* h-[calc(100vh-180px)]: Tính toán chiều cao để fit vừa màn hình, trừ đi header/padding */}
      <div className="flex flex-col flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-180px)]">
        
        {/* 1. HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa]">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">MediBot AI</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs text-green-600 font-medium">Đang hoạt động</span>
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Info size={20} />
          </button>
        </div>

        {/* 2. MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-auto 
                    ${isUser ? 'bg-gray-200' : 'bg-[#a78bfa]/20 text-[#a78bfa]'}`}>
                    {isUser ? <User size={16} className="text-gray-500"/> : <Bot size={16} />}
                  </div>

                  {/* Bubble */}
                  <div className={`relative px-5 py-3.5 shadow-sm text-sm leading-relaxed
                    ${isUser 
                      ? 'bg-[#a78bfa] text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-tl-sm'
                    }`}>
                    {msg.text}
                    {/* Time */}
                    <p className={`text-[10px] mt-1 text-right ${isUser ? 'text-white/80' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isThinking && (
            <div className="flex w-full justify-start">
              <div className="flex items-end gap-3">
                <div className="w-8 h-8 rounded-full bg-[#a78bfa]/20 text-[#a78bfa] flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center">
                  <Loader2 size={16} className="animate-spin text-[#a78bfa]" />
                  <span className="text-xs text-gray-500 ml-1">Đang soạn tin...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 3. FOOTER INPUT */}
        <div className="p-4 bg-white border-t border-gray-100">
          
          {/* Quick Suggestions (Optional) */}
          {messages.length < 3 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
              {suggestions.map((s, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(s.text)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#a78bfa]/10 hover:text-[#a78bfa] 
                    border border-gray-200 rounded-full text-xs text-gray-600 transition-all whitespace-nowrap"
                >
                  <s.icon size={12} />
                  {s.text}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi..."
              className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/50 focus:border-[#a78bfa] transition-all text-sm placeholder:text-gray-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isThinking}
              className={`p-3 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm
                ${input.trim() 
                  ? 'bg-[#a78bfa] text-white hover:bg-[#9061f9] hover:shadow-md transform hover:-translate-y-0.5' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              <Send size={20} className={input.trim() ? 'ml-0.5' : ''} />
            </button>
          </div>
          
          <p className="text-center mt-2 text-[10px] text-gray-400">
            Thông tin chỉ mang tính chất tham khảo. Vui lòng hỏi bác sĩ để có chẩn đoán chính xác.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientChatPage;