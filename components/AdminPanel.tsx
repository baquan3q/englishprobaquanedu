
import React, { useState, useEffect } from 'react';
import { ClassComment } from '../types';
import { playSound } from '../utils';

export const AdminPanel: React.FC = () => {
  const [inputPassword, setInputPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPasswordSet, setHasPasswordSet] = useState(false);
  
  // Dashboard State
  const [inputQuestion, setInputQuestion] = useState(''); // Dùng riêng cho ô nhập liệu để không bị reset
  const [activeQuestion, setActiveQuestion] = useState(''); // Dùng để hiển thị câu hỏi đang Live
  const [comments, setComments] = useState<ClassComment[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0); 

  // Check if password exists on mount
  useEffect(() => {
    const savedPwd = localStorage.getItem('admin_password');
    if (savedPwd) {
      setHasPasswordSet(true);
    } else {
      setHasPasswordSet(false);
    }
  }, []);

  // Load initial data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadData(true); // Load lần đầu (Initial)
      // Poll for updates every 2 seconds
      const interval = setInterval(() => loadData(false), 2000); // Load định kỳ (Polling)
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const loadData = (isInitialLoad: boolean) => {
    const q = localStorage.getItem('virtual_question') || '';
    const c = JSON.parse(localStorage.getItem('virtual_comments') || '[]');
    const l = localStorage.getItem('virtual_room_locked') === 'true';
    
    // Logic quan trọng: Chỉ set text vào ô nhập liệu lúc mới vào trang
    // Còn lúc đang poll (isInitialLoad = false) thì KHÔNG đụng vào ô nhập liệu
    if (isInitialLoad) {
      setInputQuestion(q);
    }
    
    setActiveQuestion(q); // Cập nhật trạng thái câu hỏi đang live
    setComments(c);
    setIsLocked(l);
    setOnlineCount(Math.floor(c.length / 2) + Math.floor(Math.random() * 5) + 1);
  };

  const handleCreatePassword = () => {
    if (inputPassword.length < 4) {
      alert("Password must be at least 4 characters!");
      return;
    }
    localStorage.setItem('admin_password', inputPassword);
    setHasPasswordSet(true);
    setIsLoggedIn(true);
    setInputPassword('');
    playSound('correct');
    alert("Password created successfully! Please remember it.");
  };

  const handleLogin = () => {
    const savedPwd = localStorage.getItem('admin_password');
    if (inputPassword === savedPwd) {
      setIsLoggedIn(true);
      playSound('correct');
    } else {
      playSound('wrong');
      alert('Wrong Password!');
    }
  };

  const handleChangePassword = () => {
    if (window.confirm("Are you sure you want to change the password? You will be logged out.")) {
      localStorage.removeItem('admin_password');
      setHasPasswordSet(false);
      setIsLoggedIn(false);
      setInputPassword('');
    }
  };

  const handleBroadcast = () => {
    localStorage.setItem('virtual_question', inputQuestion);
    setActiveQuestion(inputQuestion);
    playSound('tingting');
  };

  const toggleLock = () => {
    const newState = !isLocked;
    setIsLocked(newState);
    localStorage.setItem('virtual_room_locked', String(newState));
    playSound('click');
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to delete all student messages?")) {
      localStorage.setItem('virtual_comments', '[]');
      setComments([]);
      playSound('pop');
    }
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString();
  };

  // --- RENDER: SETUP / LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          
          <div className="text-6xl mb-4">🛡️</div>
          
          {!hasPasswordSet ? (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Admin Password</h2>
              <p className="text-sm text-slate-500 mb-6">Set a secure password to access the teacher dashboard.</p>
              <input 
                type="password" 
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="New Password"
                className="w-full border-2 border-slate-200 p-3 rounded-xl mb-4 text-center focus:border-purple-500 focus:outline-none transition-colors"
              />
              <button 
                onClick={handleCreatePassword}
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 shadow-lg transition-transform active:scale-95"
              >
                Set Password & Login
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Teacher Login</h2>
              <p className="text-sm text-slate-500 mb-6">Enter your password to continue.</p>
              <input 
                type="password" 
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter Password"
                className="w-full border-2 border-slate-200 p-3 rounded-xl mb-4 text-center focus:border-purple-500 focus:outline-none transition-colors"
              />
              <button 
                onClick={handleLogin}
                className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 shadow-lg transition-transform active:scale-95"
              >
                Access Dashboard
              </button>
              <button 
                 onClick={() => {
                   if(window.confirm("Reset password data? This is for demo purposes.")) {
                     localStorage.removeItem('admin_password');
                     setHasPasswordSet(false);
                   }
                 }}
                 className="mt-4 text-xs text-slate-400 underline hover:text-slate-600"
              >
                Forgot Password? (Reset)
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER: DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <div className="flex items-center gap-3">
             <span className="text-2xl">🎛️</span>
             <div>
               <h1 className="font-bold text-xl">Teacher Command Center</h1>
               <p className="text-xs text-slate-400">Control Panel for Virtual Room</p>
             </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="bg-slate-800 px-3 py-1 rounded-full text-sm border border-slate-700 hidden sm:block">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2 animate-pulse"></span>
                {onlineCount} Students Online
              </div>
              
              <div className="flex gap-2">
                 <button onClick={handleChangePassword} className="text-slate-400 text-sm font-bold hover:text-white px-3 py-1 border border-slate-700 rounded hover:bg-slate-800 transition-colors">
                   Change Password
                 </button>
                 <button onClick={() => setIsLoggedIn(false)} className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-4 py-1 rounded transition-colors shadow-md">
                   Logout
                 </button>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-1 space-y-6">
           
           {/* Room Status */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-500 mb-4 uppercase text-xs tracking-wider">Room Status</h3>
              <div className="flex items-center justify-between mb-4">
                 <span className={`text-xl font-bold ${isLocked ? 'text-red-500' : 'text-green-500'}`}>
                   {isLocked ? '🔒 LOCKED' : '🔓 OPEN'}
                 </span>
                 <button 
                   onClick={toggleLock}
                   className={`px-4 py-2 rounded-lg font-bold text-white transition-all ${isLocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                 >
                   {isLocked ? 'Unlock Room' : 'Lock Room'}
                 </button>
              </div>
              <p className="text-sm text-slate-400">
                {isLocked ? 'Students cannot send messages.' : 'Students can discuss freely.'}
              </p>
           </div>

           {/* Broadcast Question */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-500 mb-4 uppercase text-xs tracking-wider">Broadcast Topic</h3>
              
              <div className="mb-4 bg-purple-50 p-3 rounded-lg border border-purple-100">
                 <span className="text-xs font-bold text-purple-400 block mb-1">CURRENTLY LIVE:</span>
                 <p className="text-sm font-bold text-purple-900">{activeQuestion || "(No question set)"}</p>
              </div>

              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 focus:ring-2 focus:ring-brand-purple focus:outline-none font-medium"
                rows={4}
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Type new topic here..."
              />
              <button 
                onClick={handleBroadcast}
                className="w-full bg-brand-purple text-white font-bold py-3 rounded-xl hover:bg-purple-700 shadow-md flex items-center justify-center gap-2 transform active:scale-95 transition-all"
              >
                <span>📡</span> Broadcast Update
              </button>
           </div>

           {/* Danger Zone */}
           <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100">
              <h3 className="font-bold text-red-400 mb-4 uppercase text-xs tracking-wider">Danger Zone</h3>
              <button 
                onClick={clearChat}
                className="w-full bg-white text-red-500 border border-red-200 font-bold py-3 rounded-xl hover:bg-red-100 flex items-center justify-center gap-2 transition-colors"
              >
                <span>🗑️</span> Clear All Chat History
              </button>
           </div>
        </div>

        {/* Right Column: Live Feed */}
        <div className="lg:col-span-2">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-[600px] flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                 <h3 className="font-bold text-slate-700 flex items-center gap-2">
                   <span>💬</span> Live Student Feed
                 </h3>
                 <span className="text-xs bg-white border px-2 py-1 rounded text-green-600 font-bold flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                   Real-time
                 </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {comments.length === 0 && (
                   <div className="flex flex-col items-center justify-center h-full text-slate-400">
                     <div className="text-4xl mb-2">📭</div>
                     <p>No messages yet. Start a topic!</p>
                   </div>
                 )}
                 
                 {[...comments].reverse().map((c) => (
                   <div key={c.id} className={`flex gap-3 ${c.isTeacher ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100'} p-3 rounded-xl border shadow-sm animate-fade-in`}>
                      <div className="text-2xl">{c.avatar}</div>
                      <div className="flex-1">
                         <div className="flex justify-between items-baseline mb-1">
                            <span className="font-bold text-sm text-slate-800">{c.user} {c.isTeacher && '⭐'}</span>
                            <span className="text-xs text-slate-400 font-mono">{formatTime(c.timestamp)}</span>
                         </div>
                         <p className="text-slate-600 text-sm leading-relaxed">{c.text}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
