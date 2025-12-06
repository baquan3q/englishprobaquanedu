
import React, { useState } from 'react';
import { FILL_BLANK_DATA } from '../constants';
import { playSound } from '../utils';

export const FillBlankGame: React.FC = () => {
  const [placedWords, setPlacedWords] = useState<{[key: number]: string}>({});
  const [status, setStatus] = useState<'PLAYING' | 'CORRECT' | 'WRONG'>('PLAYING');
  const [draggedWord, setDraggedWord] = useState<string | null>(null);

  // --- DRAG AND DROP HANDLERS ---

  const handleDragStart = (e: React.DragEvent, word: string) => {
    setDraggedWord(word);
    // DataTransfer required for Firefox
    e.dataTransfer.setData('text/plain', word);
    e.dataTransfer.effectAllowed = 'move';
    playSound('click');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, slotId: number) => {
    e.preventDefault();
    if (status !== 'PLAYING' || !draggedWord) return;

    setPlacedWords(prev => ({
      ...prev,
      [slotId]: draggedWord
    }));
    setDraggedWord(null);
    playSound('click');
  };

  // Allow removing word by clicking on the slot
  const handleSlotClick = (id: number) => {
    if (status !== 'PLAYING') return;
    if (placedWords[id]) {
      const newPlaced = {...placedWords};
      delete newPlaced[id];
      setPlacedWords(newPlaced);
      playSound('click');
    }
  };

  const checkAnswers = () => {
    let allCorrect = true;
    FILL_BLANK_DATA.segments.forEach(seg => {
      if (seg.isBlank) {
        if (placedWords[seg.id] !== seg.correctWord) {
          allCorrect = false;
        }
      }
    });
    
    if (allCorrect) {
      setStatus('CORRECT');
      playSound('tingting');
      const utterance = new SpeechSynthesisUtterance("Good job!");
      window.speechSynthesis.speak(utterance);
    } else {
      setStatus('WRONG');
      playSound('haha');
    }
  };

  const resetGame = () => {
    setPlacedWords({});
    setStatus('PLAYING');
    setDraggedWord(null);
    playSound('click');
  };

  // Determine which words from bank are available (logic: if count in bank > count placed)
  const getWordCount = (word: string) => FILL_BLANK_DATA.wordBank.filter(w => w === word).length;
  const getPlacedCount = (word: string) => Object.values(placedWords).filter(w => w === word).length;

  return (
    <div className="max-w-4xl mx-auto p-4 relative min-h-[600px]">
      <div className="bg-white rounded-3xl shadow-xl p-8 border-t-8 border-brand-pink">
        <h2 className="text-3xl font-display font-bold text-brand-pink mb-2 text-center">Read and Complete</h2>
        <p className="text-center text-slate-500 mb-8">Kéo từ bên dưới thả vào ô trống thích hợp!</p>
        
        {/* The Text Area */}
        <div className="bg-orange-50 p-8 rounded-2xl border-2 border-orange-200 text-xl leading-loose font-medium text-slate-700 shadow-inner mb-8">
           {FILL_BLANK_DATA.segments.map((seg, idx) => {
             if (!seg.isBlank) return <span key={idx}>{seg.text}</span>;
             
             const isFilled = !!placedWords[seg.id];
             
             return (
               <span 
                key={seg.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, seg.id)}
                onClick={() => handleSlotClick(seg.id)}
                className={`inline-flex items-center justify-center min-w-[100px] h-10 border-b-4 mx-1 px-3 rounded transition-all select-none
                  ${isFilled 
                    ? 'bg-blue-100 border-blue-400 text-blue-800 font-bold cursor-pointer hover:bg-red-100 hover:border-red-400 hover:text-red-500' // Hover to delete style
                    : 'bg-white border-slate-300 border-dashed animate-pulse'
                  }
                  ${status === 'CORRECT' ? '!bg-green-100 !border-green-500 !text-green-800' : ''}
                  ${status === 'WRONG' && isFilled ? '!bg-red-50 !border-red-300 !text-slate-600' : ''}
                `}
               >
                 {placedWords[seg.id] || <span className="text-slate-300 text-sm">Drop here</span>}
               </span>
             );
           })}
        </div>

        {/* Translation (Only show when not playing or purely as help?) 
            User requested show answer on failure previously, keeping simple for drag/drop flow
        */}
        {status === 'WRONG' && (
             <div className="mb-8 p-4 bg-red-50 rounded-xl border border-red-100">
               <p className="text-center text-red-500 font-bold">Chưa đúng rồi! Hãy thử lại nhé.</p>
             </div>
        )}

        {/* Word Bank (Draggable) */}
        {status !== 'CORRECT' && (
          <div className="flex flex-wrap gap-4 justify-center mb-12 min-h-[80px] bg-slate-100 p-6 rounded-2xl border-2 border-slate-200 border-dashed">
            {FILL_BLANK_DATA.wordBank.map((word, i) => {
              // Unique key logic handling duplicates if necessary
              // Simple logic: Render word if available count > 0
              // But map index is easier for rendering UI
              const isAvailable = getPlacedCount(word) < getWordCount(word);

              return (
                <div
                  key={i}
                  draggable={isAvailable}
                  onDragStart={(e) => handleDragStart(e, word)}
                  className={`px-6 py-2 rounded-xl font-bold text-lg shadow-md border-2 transition-all cursor-grab active:cursor-grabbing
                    ${isAvailable 
                      ? 'bg-white text-brand-purple border-brand-purple hover:scale-105 hover:bg-purple-50' 
                      : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50'}
                  `}
                >
                  {word}
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="text-center pb-8">
            <button 
              onClick={checkAnswers}
              disabled={status === 'CORRECT'}
              className="bg-brand-green text-white text-xl font-bold px-12 py-4 rounded-full shadow-lg hover:bg-green-500 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Nộp Bài
            </button>
        </div>

      </div>

      {/* --- POPUP MODALS --- */}

      {/* SUCCESS MODAL */}
      {status === 'CORRECT' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm rounded-3xl animate-fade-in">
           <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-500 text-center max-w-md w-full animate-bounce-slight relative overflow-hidden">
               {/* Confetti fake effect */}
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>
               
               <div className="text-6xl mb-4">🥳 ⭐ 💯</div>
               <h2 className="text-3xl font-display font-black text-brand-purple mb-2">CHÚC MỪNG!</h2>
               <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl font-bold text-2xl mb-6 border-2 border-yellow-300 rotate-2">
                 Vào sổ đầu bài 10đ
               </div>
               
               <button 
                 onClick={resetGame}
                 className="bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 shadow-lg"
               >
                 Làm lại bài khác
               </button>
           </div>
        </div>
      )}

      {/* FAILURE MODAL */}
      {status === 'WRONG' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm rounded-3xl animate-fade-in">
           <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-red-400 text-center max-w-md w-full animate-shake relative">
               <div className="text-6xl mb-4">😅</div>
               
               {/* Sticker Image (Placeholder SVG) */}
               <div className="w-32 h-32 mx-auto mb-4 animate-bounce">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                     <circle cx="50" cy="50" r="45" fill="#FFD93D" stroke="#F4C724" strokeWidth="3"/>
                     <circle cx="35" cy="40" r="5" fill="#333"/>
                     <circle cx="65" cy="40" r="5" fill="#333"/>
                     {/* Sweat drop */}
                     <path d="M80,30 Q85,20 80,15 Q75,20 80,30" fill="#4CC9F0" />
                     {/* Smile */}
                     <path d="M30,70 Q50,80 70,70" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
                     {/* Cheeks */}
                     <circle cx="25" cy="55" r="5" fill="#FF9AA2" opacity="0.6"/>
                     <circle cx="75" cy="55" r="5" fill="#FF9AA2" opacity="0.6"/>
                     {/* Arm cheering */}
                     <path d="M85,60 Q95,40 90,30" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
               </div>

               <h2 className="text-2xl font-display font-bold text-red-500 mb-2">Cố lên nào!</h2>
               <p className="text-slate-600 text-lg mb-6 font-bold">
                 "Làm lại đến khi nào đúng em nhé!"
               </p>
               
               <button 
                 onClick={() => {
                   setStatus('PLAYING'); 
                   playSound('click');
                 }}
                 className="bg-brand-green text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 shadow-lg"
               >
                 Thử lại ngay
               </button>
           </div>
        </div>
      )}

    </div>
  );
};
