

import React, { useState } from 'react';
import { WHEEL_SEGMENTS, WHEEL_QUESTIONS } from '../constants';
import { playSound } from '../utils';

export const LuckyWheelGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<typeof WHEEL_QUESTIONS[0] | null>(null);
  
  // State for Big Overlay Messages
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);
  const [overlayType, setOverlayType] = useState<'correct' | 'wrong' | null>(null);

  const numSegments = WHEEL_SEGMENTS.length;
  const segmentAngle = 360 / numSegments; // 60 degrees

  const spin = () => {
    if (isSpinning || currentQuestion || overlayMessage) return;

    setIsSpinning(true);
    setOverlayMessage(null);
    setOverlayType(null);

    // Random spins
    const spins = 5;
    const randomDegree = Math.floor(Math.random() * 360);
    const totalDegree = rotation + (spins * 360) + randomDegree;
    
    setRotation(totalDegree);

    // Sound effect interval
    let ticks = 0;
    const maxTicks = 20;
    const interval = setInterval(() => {
        ticks++;
        playSound('spin');
        if (ticks > maxTicks) clearInterval(interval);
    }, 150);

    setTimeout(() => {
      setIsSpinning(false);
      determineWinner();
    }, 3000);
  };

  const determineWinner = () => {
    // Just pick a random question for the game logic
    // In a real wheel, we would calculate index based on rotation % 360
    const randomQ = WHEEL_QUESTIONS[Math.floor(Math.random() * WHEEL_QUESTIONS.length)];
    setCurrentQuestion(randomQ);
    playSound('correct'); 
  };

  const handleAnswer = (option: string) => {
    if (!currentQuestion) return;

    if (option === currentQuestion.correctAnswer) {
      // CORRECT
      playSound('win');
      setOverlayType('correct');
      setOverlayMessage("Quá tốt rồi tiếp đii cưng à ^-^");
      
      setTimeout(() => {
        setOverlayMessage(null);
        setOverlayType(null);
        setCurrentQuestion(null); 
      }, 2500);
    } else {
      // WRONG
      playSound('wrong');
      setOverlayType('wrong');
      setOverlayMessage("Non và Xanh lắm bé cưng ơii =))");
      
      setTimeout(() => {
        setOverlayMessage(null);
        setOverlayType(null);
      }, 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen flex flex-col items-center justify-center overflow-hidden relative">
      
      {/* Header */}
      <div className="absolute top-4 left-4 z-20">
         <button onClick={onBack} className="bg-white hover:bg-gray-100 px-6 py-2 rounded-full font-bold shadow-md text-slate-700 border-2 border-slate-200">
           ← Exit
         </button>
      </div>

      <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-8 drop-shadow-sm text-center">
        Lucky Wheel AI
      </h1>

      {/* Main Wheel Container */}
      <div className="relative w-[340px] h-[340px] md:w-[450px] md:h-[450px]">
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5 z-20 w-10 h-14 drop-shadow-xl filter">
           <svg viewBox="0 0 24 24" fill="#FFD700" stroke="#B8860B" strokeWidth="2">
             <path d="M12 22L2 2h20L12 22z" />
           </svg>
        </div>

        {/* The Wheel */}
        <div 
          className="w-full h-full rounded-full border-8 border-white shadow-2xl relative overflow-hidden transition-transform cubic-bezier(0.25, 0.1, 0.25, 1)"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? '3s' : '0s'
          }}
        >
           {/* Render Segments (Colored Backgrounds) */}
           {WHEEL_SEGMENTS.map((seg, i) => (
             <div
               key={`seg-${i}`}
               className="absolute w-full h-full top-0 left-0 origin-center"
               style={{
                  transform: `rotate(${i * segmentAngle}deg)`,
               }}
             >
               <div 
                 className="absolute w-full h-full origin-bottom-right"
                 style={{
                   backgroundColor: seg.color,
                   width: '50%',
                   height: '50%',
                   top: '0',
                   left: '50%',
                   transformOrigin: 'bottom left',
                   transform: `skewY(-${90 - segmentAngle}deg)`, 
                   borderLeft: '2px solid white'
                 }}
               />
             </div>
           ))}

           {/* Render Text Labels (Separate Layer to avoid Skew distortion) */}
           {WHEEL_SEGMENTS.map((seg, i) => {
             // Calculate rotation for text to be in the center of the segment
             // Segment starts at i*60. Center is i*60 + 30.
             const centerAngle = (i * segmentAngle) + (segmentAngle / 2);
             
             return (
              <div
                key={`label-${i}`}
                className="absolute w-full h-full top-0 left-0 flex items-center justify-center pointer-events-none"
                style={{
                  // Rotate container to point to slice center
                  transform: `rotate(${centerAngle}deg)`
                }}
              >
                 <div 
                    className="absolute"
                    style={{
                      // Push text out to radius
                      top: '15%', 
                      transform: 'rotate(0deg)', // Keep text upright relative to radius? Or horizontal?
                    }}
                 >
                    <span 
                      className="block font-bold text-sm md:text-lg font-display uppercase tracking-wider whitespace-nowrap"
                      style={{ 
                        color: seg.textColor,
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                        // Rotate text -90 deg so it reads from center outward
                        transform: 'rotate(-90deg) translate(20px, 0)'
                      }}
                    >
                      {seg.label}
                    </span>
                 </div>
              </div>
             );
           })}

        </div>

        {/* Center Cap / Spin Button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
           <button 
             onClick={spin}
             disabled={isSpinning || !!currentQuestion}
             className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-inner border-4 border-slate-200 flex items-center justify-center font-bold text-xl text-brand-purple hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
           >
             SPIN
           </button>
        </div>
      </div>

      {/* FULL SCREEN OVERLAY FEEDBACK */}
      {overlayMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
           <div className={`text-4xl md:text-6xl font-black text-center px-4 leading-tight drop-shadow-2xl animate-bounce-slight
             ${overlayType === 'correct' ? 'text-green-400' : 'text-red-500'}
           `}>
              {overlayMessage}
           </div>
        </div>
      )}

      {/* Question Modal */}
      {currentQuestion && !overlayMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-b-8 border-brand-blue relative transform transition-all scale-100">
              <div className="text-center">
                 <div className="w-16 h-16 bg-brand-blue text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 font-bold shadow-lg">
                   ?
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800 mb-6">{currentQuestion.question}</h3>
                 
                 <div className="grid gap-3">
                    {currentQuestion.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-brand-purple hover:bg-purple-50 font-bold text-slate-700 transition-all text-left flex items-center gap-3 active:scale-95"
                      >
                         <span className="bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">{String.fromCharCode(65 + i)}</span>
                         {opt}
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
