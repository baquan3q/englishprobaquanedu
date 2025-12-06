
import React, { useState, useRef, useEffect } from 'react';
import { streamChatWithGemini } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AiTutor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hế lô! **Siêu AI Bá Đạo** đây 😎. Hỏi gì khó khó xíu đi, chứ mấy cái dễ quá tui trả lời trong 1 nốt nhạc! 🎵🔥' }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isStreaming]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg = input;
    setInput('');
    setIsStreaming(true);
    
    // 1. Add User Message
    const newHistory = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(newHistory);

    // 2. Add Placeholder for AI Message
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    // Prepare history for API (exclude the empty placeholder we just added)
    const apiHistory = newHistory.map(m => ({
      role: m.role,
      parts: [{ text: m.text }] as [{ text: string }]
    }));

    // 3. Stream Response
    await streamChatWithGemini(userMsg, apiHistory, (chunk) => {
      setMessages(current => {
        const updated = [...current];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg.role === 'model') {
          lastMsg.text += chunk;
        }
        return updated;
      });
    });

    setIsStreaming(false);
  };

  // Simple Markdown Parser for Bold text (**text**)
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-brand-purple font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-2 border-white overflow-hidden flex flex-col h-[550px] animate-fade-in-up ring-4 ring-black/5">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-inner">
                  🤖
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold font-display text-lg leading-none">Siêu AI Bá Đạo</h3>
                <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold text-indigo-100">Gen Z Assistant</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="bg-white/10 hover:bg-white/20 rounded-full p-2 w-8 h-8 flex items-center justify-center transition-colors text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs mr-2 shrink-0 shadow-lg mt-1">
                    AI
                  </div>
                )}
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">
                    {renderMessageContent(msg.text)}
                  </div>
                  {/* Small decorative tail */}
                  <div className={`absolute top-0 w-0 h-0 border-[6px] border-transparent ${
                    msg.role === 'user' 
                      ? 'right-[-6px] border-t-blue-600 border-l-blue-600' 
                      : 'left-[-6px] border-t-white border-r-white'
                  }`}></div>
                </div>
              </div>
            ))}
            
            {isStreaming && messages[messages.length - 1]?.text === '' && (
               <div className="flex justify-start items-center ml-10">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Chat gì đó vui vui đi..."
              className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-3 text-sm text-slate-700 focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all placeholder-slate-400 font-medium"
            />
            <button 
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white w-11 h-11 rounded-full flex items-center justify-center hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative focus:outline-none"
      >
        <span className={`absolute top-0 right-0 flex h-5 w-5 -mt-1 -mr-1 transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white"></span>
        </span>
        
        <div className={`
          flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 border-4 border-white
          ${isOpen ? 'bg-slate-800 rotate-90 scale-90' : 'bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 hover:scale-110'}
        `}>
          {isOpen ? (
            <span className="text-2xl font-bold text-white">✕</span>
          ) : (
            <span className="text-3xl filter drop-shadow-md">🤖</span>
          )}
        </div>
      </button>
    </div>
  );
};
