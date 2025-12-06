
import React, { useState, useEffect, useRef } from 'react';
import { DIALOGUE_SCRIPT } from '../constants';

export const DialogueSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  
  // Use a ref to keep track of the current line index in the timeout closure
  const indexRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakLine = (index: number) => {
    if (index >= DIALOGUE_SCRIPT.length) {
      setIsPlaying(false);
      return;
    }

    const line = DIALOGUE_SCRIPT[index];
    setCurrentLineIndex(index);
    indexRef.current = index;

    // Scroll to active line
    const element = document.getElementById(`line-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const utterance = new SpeechSynthesisUtterance(line.text);
    // Attempt to change voice based on speaker (gender approximation)
    const voices = window.speechSynthesis.getVoices();
    if (line.speaker === 'Mai') {
      const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha'));
      if (femaleVoice) utterance.voice = femaleVoice;
    } else {
       const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Daniel'));
       if (maleVoice) utterance.voice = maleVoice;
    }
    
    utterance.rate = 0.9;
    
    utterance.onend = () => {
      if (isPlaying) {
        // Small pause between speakers
        timerRef.current = window.setTimeout(() => {
            if (isPlaying) speakLine(index + 1);
        }, 800);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (isPlaying) {
      // Pause
      window.speechSynthesis.cancel();
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsPlaying(false);
    } else {
      // Start
      setIsPlaying(true);
      speakLine(currentLineIndex);
    }
  };

  const handleReset = () => {
    window.speechSynthesis.cancel();
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setCurrentLineIndex(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      
      {/* Dialogue Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-brand-green">
        <div className="bg-brand-green p-4 flex justify-between items-center text-white">
          <h2 className="text-2xl font-display font-bold">Listen and Read</h2>
          <div className="flex gap-2">
             <button 
              onClick={() => setShowTranslation(!showTranslation)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold"
            >
              {showTranslation ? 'Hide Vietnamese' : 'Show Vietnamese'}
            </button>
          </div>
        </div>

        <div className="h-[400px] overflow-y-auto p-6 bg-slate-50 space-y-4">
          {DIALOGUE_SCRIPT.map((line, idx) => (
            <div 
              key={line.id} 
              id={`line-${idx}`}
              className={`flex gap-4 transition-all duration-300 ${idx === currentLineIndex ? 'opacity-100 scale-105' : 'opacity-60'}`}
              onClick={() => {
                window.speechSynthesis.cancel();
                setIsPlaying(true);
                speakLine(idx);
              }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                line.speaker === 'Mai' ? 'bg-pink-400' : line.speaker === 'Nam' ? 'bg-blue-400' : 'bg-green-400'
              }`}>
                {line.speaker[0]}
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-600 mb-1">{line.speaker}</div>
                <div className={`p-3 rounded-2xl rounded-tl-none inline-block shadow-sm ${idx === currentLineIndex ? 'bg-brand-blue text-white' : 'bg-white text-slate-800'}`}>
                  <p className="text-lg">{line.text}</p>
                  {showTranslation && (
                    <p className={`text-sm italic mt-1 ${idx === currentLineIndex ? 'text-blue-100' : 'text-slate-500'}`}>{line.translation}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-100 border-t flex justify-center gap-4">
          <button 
            onClick={handlePlay}
            className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transform transition active:scale-95 ${isPlaying ? 'bg-orange-500' : 'bg-brand-green'}`}
          >
            {isPlaying ? 'Pause' : 'Play Conversation'}
          </button>
          <button 
            onClick={handleReset}
            className="px-6 py-3 rounded-full font-bold text-slate-600 bg-white shadow-md hover:bg-gray-50"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Extra Practice - Youtube Section */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-red-500 flex flex-col md:flex-row items-center gap-6 animate-fade-in-up">
         <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
           <iframe 
             width="100%" 
             height="100%" 
             src="https://www.youtube.com/embed/KZaBXLrpSrU" 
             title="Extra Listening Practice" 
             frameBorder="0" 
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
             allowFullScreen
           ></iframe>
         </div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-display font-bold text-red-500 mb-3 drop-shadow-sm">
              Luyện nghe thêm đi mới giỏi lên được !!!
            </h3>
            <div className="text-6xl animate-bounce-slight mb-4">👂🔥</div>
            <p className="text-slate-600 text-lg">
              Practice makes perfect! Watch this video to improve your pronunciation and listening skills for Unit 1.
            </p>
         </div>
      </div>

    </div>
  );
};
