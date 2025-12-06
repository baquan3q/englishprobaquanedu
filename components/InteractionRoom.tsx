
import React, { useState, useEffect, useRef } from 'react';
import { ClassComment } from '../types';
import { playSound } from '../utils';

const AVATARS = ['🦊', '🐼', '🐯', '🦄', '👽', '🤖', '🐱', '🐶'];

export const InteractionRoom: React.FC = () => {
  // State for User Identity
  const [userName, setUserName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  // State for Room Content
  const [question, setQuestion] = useState("Waiting for teacher...");
  const [comments, setComments] = useState<ClassComment[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevCommentsLengthRef = useRef(0);

  // Load data from LocalStorage on mount & Set up Polling
  useEffect(() => {
    // Identity
    const savedUser = localStorage.getItem('virtual_user');
    const savedAvatar = localStorage.getItem('virtual_avatar');
    if (savedUser && savedAvatar) {
      setUserName(savedUser);
      setSelectedAvatar(savedAvatar);
      setIsJoined(true);
    }

    // Initial Load
    syncData();

    // Polling Mechanism (Simulate Real-time Socket)
    const interval = setInterval(() => {
      syncData();
    }, 1000); // Check every 1 second

    return () => clearInterval(interval);
  }, []);

  const syncData = () => {
    // 1. Sync Comments
    const savedComments = localStorage.getItem('virtual_comments');
    if (savedComments) {
      const parsed = JSON.parse(savedComments);
      setComments(parsed);
      
      // Play sound if new message arrived (simple check)
      if (parsed.length > prevCommentsLengthRef.current) {
         // Only play if I'm joined
         // playSound('pop'); // Optional: can be annoying if loop
      }
      prevCommentsLengthRef.current = parsed.length;
    }

    // 2. Sync Question
    const savedQuestion = localStorage.getItem('virtual_question');
    if (savedQuestion) {
      setQuestion(savedQuestion);
    }

    // 3. Sync Room Status
    const locked = localStorage.getItem('virtual_room_locked') === 'true';
    setIsLocked(locked);
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleJoin = () => {
    if (userName.trim() && selectedAvatar) {
      localStorage.setItem('virtual_user', userName);
      localStorage.setItem('virtual_avatar', selectedAvatar);
      setIsJoined(true);
      playSound('click');
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || isLocked) return;

    const newComment: ClassComment = {
      id: Date.now(),
      user: userName,
      avatar: selectedAvatar,
      text: inputText,
      timestamp: Date.now(),
      isTeacher: false // Students are not teachers in this view
    };

    // Optimistic Update
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem('virtual_comments', JSON.stringify(updatedComments));
    
    setInputText('');
    playSound('pop');
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- RENDER: LOGIN SCREEN ---
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-mono">
        <div className="bg-slate-800 p-8 rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.3)] border border-slate-700 max-w-md w-full text-center relative overflow-hidden">
           {/* Cyber Decoration */}
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400"></div>
           
           <h2 className="text-3xl font-bold text-white mb-2 font-display tracking-wider">VIRTUAL ACCESS</h2>
           <p className="text-cyan-400 mb-8 text-sm uppercase tracking-widest">Identify Yourself</p>

           <div className="mb-6">
             <label className="block text-slate-400 text-sm mb-2 text-left">Your Codename (Name)</label>
             <input 
               type="text" 
               value={userName}
               onChange={(e) => setUserName(e.target.value)}
               className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-600"
               placeholder="Enter your name..."
             />
           </div>

           <div className="mb-8">
             <label className="block text-slate-400 text-sm mb-4 text-left">Select Avatar</label>
             <div className="grid grid-cols-4 gap-4">
               {AVATARS.map(av => (
                 <button 
                   key={av}
                   onClick={() => setSelectedAvatar(av)}
                   className={`text-3xl p-3 rounded-xl border-2 transition-all hover:scale-110 ${selectedAvatar === av ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'border-slate-700 bg-slate-900 grayscale hover:grayscale-0'}`}
                 >
                   {av}
                 </button>
               ))}
             </div>
           </div>

           <button 
             onClick={handleJoin}
             disabled={!userName || !selectedAvatar}
             className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(192,38,211,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
           >
             ENTER ROOM_
           </button>
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN ROOM ---
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 shadow-lg flex justify-between items-center z-10 sticky top-0">
         <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_red] ${isLocked ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <h1 className="font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
              VIRTUAL CLASSROOM <span className="text-slate-500 text-xs font-mono ml-2">[LIVE]</span>
            </h1>
         </div>
         <div className="flex items-center gap-4">
            {isLocked && (
               <div className="bg-red-500/20 border border-red-500 text-red-400 px-3 py-1 rounded text-xs font-bold uppercase animate-pulse">
                 Room Locked
               </div>
            )}
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
               <span className="text-xl">{selectedAvatar}</span>
               <span className="font-bold text-sm text-cyan-300">{userName}</span>
            </div>
         </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-4 flex flex-col gap-6">
         
         {/* Teacher's Board */}
         <div className="bg-slate-800/80 backdrop-blur rounded-3xl p-1 border-2 border-fuchsia-500/50 shadow-[0_0_30px_rgba(192,38,211,0.15)] relative group transition-all">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-fuchsia-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
               Discussion Topic
            </div>
            
            <div className="bg-slate-900/50 rounded-[20px] p-6 text-center min-h-[120px] flex items-center justify-center">
                 <h2 className="text-2xl md:text-3xl font-display font-bold leading-relaxed drop-shadow-md animate-fade-in">
                   "{question}"
                 </h2>
            </div>
         </div>

         {/* Chat Stream */}
         <div className="flex-1 bg-slate-800/50 rounded-3xl border border-slate-700 overflow-hidden flex flex-col shadow-inner relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
               {comments.length === 0 && (
                 <div className="text-center text-slate-600 mt-20 italic">No comments yet. Wait for the teacher...</div>
               )}
               
               {comments.map((comment) => {
                 const isMe = comment.user === userName;
                 return (
                   <div key={comment.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up`}>
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg border-2 ${comment.isTeacher ? 'bg-yellow-100 border-yellow-400' : isMe ? 'bg-cyan-900 border-cyan-400' : 'bg-slate-700 border-slate-500'}`}>
                        {comment.avatar}
                      </div>
                      
                      {/* Bubble */}
                      <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                         <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold ${comment.isTeacher ? 'text-yellow-400' : isMe ? 'text-cyan-400' : 'text-slate-400'}`}>
                              {comment.user} {comment.isTeacher && '⭐'}
                            </span>
                            <span className="text-[10px] text-slate-600">{formatTime(comment.timestamp)}</span>
                         </div>
                         <div className={`px-4 py-2 rounded-2xl shadow-md text-sm leading-relaxed ${
                           isMe 
                             ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-none' 
                             : comment.isTeacher 
                               ? 'bg-gradient-to-br from-yellow-600 to-orange-600 text-white border border-yellow-400'
                               : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
                         }`}>
                           {comment.text}
                         </div>
                      </div>
                   </div>
                 );
               })}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={`p-4 bg-slate-800 border-t border-slate-700 flex gap-3 z-10 transition-all ${isLocked ? 'opacity-50 grayscale' : ''}`}>
               {isLocked ? (
                  <div className="w-full py-3 text-center text-red-400 font-bold bg-slate-900/50 rounded-full border border-red-900/50">
                     🚫 Chat is disabled by the teacher
                  </div>
               ) : (
                 <>
                   <input 
                     type="text" 
                     value={inputText}
                     onChange={(e) => setInputText(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                     placeholder="Type your answer here..."
                     className="flex-1 bg-slate-900 text-white rounded-full px-6 py-3 border border-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500"
                   />
                   <button 
                     onClick={handleSend}
                     disabled={!inputText.trim()}
                     className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                   >
                     ➤
                   </button>
                 </>
               )}
            </div>
         </div>

      </div>
    </div>
  );
};
