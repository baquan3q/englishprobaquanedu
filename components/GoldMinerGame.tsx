
import React, { useState, useEffect, useRef } from 'react';
import { MINER_QUESTIONS } from '../constants';
import { QuizQuestion, GameTarget } from '../types';
import { playSound } from '../utils';
import { saveScoreToDatabase } from '../services/api';

export const GoldMinerGame: React.FC = () => {
  // Game State
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'SHOOTING' | 'REWINDING'>('IDLE');
  
  // Hook Physics
  const [angle, setAngle] = useState(0);
  const [ropeLength, setRopeLength] = useState(10); // Percent
  const angleDirection = useRef(1); // 1 or -1
  
  // Logic Refs
  const stateRef = useRef<'IDLE' | 'SHOOTING' | 'REWINDING'>('IDLE');
  const angleRef = useRef(0);
  const lengthRef = useRef(10);
  const caughtTargetRef = useRef<GameTarget | null>(null);
  const hasSavedScore = useRef(false);
  
  // Data
  const [targets, setTargets] = useState<GameTarget[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Initialize Targets with Random Sizes
  useEffect(() => {
    const newTargets = MINER_QUESTIONS.map((q, idx) => {
      // Randomize size: Small (40px) to Large (90px)
      const sizeRandomizer = Math.random();
      let width, height, value;

      if (sizeRandomizer < 0.3) {
        // Small gold
        width = 45;
        height = 45;
        value = 50; // Fast to pull, less points
      } else if (sizeRandomizer < 0.7) {
        // Medium gold
        width = 65;
        height = 65;
        value = 100;
      } else {
        // Big gold
        width = 90;
        height = 80;
        value = 200; // Slow to pull, big points
      }

      return {
        id: q.id,
        x: 10 + (idx * 23) + (Math.random() * 5), // Distributed horizontally
        y: 35 + (Math.random() * 45), // Random depth
        width: width,
        height: height,
        value: value,
        solved: false,
        visible: true,
      };
    });
    setTargets(newTargets);
  }, []);

  // Main Game Loop
  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      if (stateRef.current === 'IDLE') {
        let newAngle = angleRef.current + (0.8 * angleDirection.current); 
        if (newAngle > 70) {
          newAngle = 70;
          angleDirection.current = -1;
        } else if (newAngle < -70) {
          newAngle = -70;
          angleDirection.current = 1;
        }
        angleRef.current = newAngle;
        setAngle(newAngle);
      } 
      else if (stateRef.current === 'SHOOTING') {
        const newLength = lengthRef.current + 1.5; 
        lengthRef.current = newLength;
        setRopeLength(newLength);

        // Check Collision
        const rad = (angleRef.current * Math.PI) / 180;
        // Adjust coordinate calculation based on container aspect ratio approx
        const hookTipX = 50 - (Math.sin(rad) * newLength * 0.6); 
        const hookTipY = newLength; 

        const hit = targets.find(t => {
          if (t.solved || !t.visible) return false;
          
          // Approximate hit box in percentage relative to game board
          // Assuming board width ~800px. 10% ~ 80px.
          const targetWidthPercent = (t.width / 800) * 100;
          const targetHeightPercent = (t.height / 600) * 100;
          
          const dx = Math.abs(hookTipX - t.x);
          const dy = Math.abs(hookTipY - t.y);

          // Simple box collision
          return dx < (targetWidthPercent / 1.5) && dy < (targetHeightPercent / 1.5);
        });

        if (hit) {
          playSound('hit');
          stateRef.current = 'REWINDING';
          setGameState('REWINDING');
          caughtTargetRef.current = hit;
        } else if (newLength > 95) {
          stateRef.current = 'REWINDING';
          setGameState('REWINDING');
        }
      } 
      else if (stateRef.current === 'REWINDING') {
        // Physics: Heavier objects (bigger width) are slower
        let retractSpeed = 2.5;
        if (caughtTargetRef.current) {
           const size = caughtTargetRef.current.width;
           if (size > 80) retractSpeed = 0.8; // Heavy
           else if (size > 60) retractSpeed = 1.2; // Medium
           else retractSpeed = 1.8; // Light
        }

        const newLength = lengthRef.current - retractSpeed;
        
        if (newLength <= 10) {
          lengthRef.current = 10;
          setRopeLength(10);
          stateRef.current = 'IDLE';
          setGameState('IDLE');
          
          if (caughtTargetRef.current) {
            const question = MINER_QUESTIONS.find(q => q.id === caughtTargetRef.current?.id);
            if (question) setActiveQuestion(question);
            setTargets(prev => prev.map(t => t.id === caughtTargetRef.current?.id ? {...t, visible: false} : t));
            caughtTargetRef.current = null;
          }
        } else {
          lengthRef.current = newLength;
          setRopeLength(newLength);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targets]);

  const handleShoot = () => {
    if (stateRef.current === 'IDLE' && !activeQuestion) {
      playSound('shoot');
      stateRef.current = 'SHOOTING';
      setGameState('SHOOTING');
    }
  };

  const handleAnswer = (option: string) => {
    if (!activeQuestion) return;
    
    // Find the target to get its value
    const target = targets.find(t => t.id === activeQuestion.id);
    const points = target ? target.value : 100;

    if (option === activeQuestion.answer) {
      playSound('win');
      setFeedback(`Correct! +${points} Gold`);
      setScore(s => s + points);
      setTargets(prev => prev.map(t => t.id === activeQuestion.id ? {...t, solved: true} : t));
      
      setTimeout(() => {
        setActiveQuestion(null);
        setFeedback(null);
      }, 1500);
    } else {
      playSound('wrong'); 
      setFeedback("Wrong! The gold slipped away...");
      // Return target to field
      setTargets(prev => prev.map(t => t.id === activeQuestion.id ? {...t, visible: true} : t));
      
      setTimeout(() => {
        setActiveQuestion(null);
        setFeedback(null);
      }, 1500);
    }
  };

  const allSolved = targets.length > 0 && targets.every(t => t.solved);

  // Auto save score when all solved
  useEffect(() => {
    if (allSolved && !hasSavedScore.current) {
      hasSavedScore.current = true;
      // Get user name from virtual room or default
      const username = localStorage.getItem('virtual_user') || 'Anonymous Student';
      saveScoreToDatabase(username, 'GOLD_MINER', score);
    }
  }, [allSolved, score]);

  return (
    <div className="max-w-4xl mx-auto p-4 select-none">
      <div className="bg-gradient-to-b from-sky-300 via-sky-100 to-amber-100 h-[600px] rounded-3xl relative overflow-hidden shadow-2xl border-8 border-amber-500">
        
        {/* Background Clouds */}
        <div className="absolute top-10 left-10 text-white opacity-60 animate-float text-6xl">☁️</div>
        <div className="absolute top-20 right-20 text-white opacity-60 animate-float text-6xl" style={{animationDelay: '1s'}}>☁️</div>

        {/* Score Board */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-yellow-600 px-6 py-3 rounded-full font-display font-bold border-4 border-yellow-400 z-20 shadow-lg flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <span className="text-3xl">{score}</span>
        </div>

        {/* Character Base (The Girl) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
             {/* Simple SVG Girl Character */}
             <div className="relative -mb-2">
               <svg width="80" height="80" viewBox="0 0 100 100">
                 <path d="M20,40 Q10,60 15,70 M80,40 Q90,60 85,70" stroke="#333" strokeWidth="8" fill="none" />
                 <circle cx="50" cy="40" r="30" fill="#FFD1DC" stroke="#333" strokeWidth="2"/>
                 <circle cx="40" cy="35" r="3" fill="#333"/>
                 <circle cx="60" cy="35" r="3" fill="#333"/>
                 <path d="M45,50 Q50,55 55,50" fill="none" stroke="#333" strokeWidth="2"/>
                 <path d="M25,25 Q50,15 75,25" fill="#333"/>
                 <path d="M30,70 L70,70 L80,100 L20,100 Z" fill="#FF69B4" />
               </svg>
             </div>
             {/* Machine Pivot */}
             <div className="w-16 h-8 bg-gray-700 rounded-b-xl border-b-4 border-gray-500"></div>
        </div>

        {/* The Hook System */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 mt-6">
            <div 
              className="origin-top transition-none"
              style={{ transform: `rotate(${angle}deg)` }}
            >
               <div 
                  className="w-1 bg-amber-800 mx-auto"
                  style={{ height: `${ropeLength * 5.5}px` }} 
               ></div>
               
               <div 
                 className="relative -ml-4"
                 style={{ transform: `translateY(${0}px)` }}
               >
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
                      <path d="M12 2L4 10H8V20H16V10H20L12 2Z" fill="#94a3b8" stroke="#475569" strokeWidth="2"/>
                  </svg>
                  
                  {gameState === 'REWINDING' && caughtTargetRef.current && (
                    <div 
                      className="absolute top-4 -left-1/2 animate-bounce-slight"
                      style={{ 
                        width: caughtTargetRef.current.width, 
                        height: caughtTargetRef.current.height,
                        marginLeft: -caughtTargetRef.current.width / 4 
                      }}
                    >
                       <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl filter brightness-110">
                          <path d="M10,30 Q50,5 90,30 L90,80 Q50,100 10,80 Z" fill="url(#goldGrad)" stroke="#B8860B" strokeWidth="3" />
                          <text x="50" y="60" textAnchor="middle" fontSize="30" fill="#B8860B" fontWeight="bold">$</text>
                      </svg>
                    </div>
                  )}
               </div>
            </div>
        </div>

        {/* Targets (Gold Bags) */}
        {targets.map(target => !target.solved && target.visible && (
          <div 
            key={target.id}
            className="absolute transition-none"
            style={{ 
              left: `${target.x}%`, 
              top: `${target.y}%`,
              width: `${target.width}px`,
              height: `${target.height}px`,
              transform: 'translate(-50%, 0)'
            }}
          >
             <div className="w-full h-full animate-bounce-slight hover:scale-105 transition-transform">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                  <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF7CC" />
                      <stop offset="20%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#B8860B" />
                    </linearGradient>
                  </defs>
                  <path d="M10,30 Q50,5 90,30 L90,80 Q50,100 10,80 Z" fill="url(#goldGrad)" stroke="#B8860B" strokeWidth="3" />
                  <path d="M30,40 Q50,50 70,40" fill="none" stroke="#B8860B" strokeWidth="2" opacity="0.5" />
                  {target.value > 150 && <text x="50" y="65" textAnchor="middle" fontSize="20" fill="#B8860B" fontWeight="bold">BIG</text>}
                </svg>
             </div>
          </div>
        ))}

        {/* Controls */}
        {gameState === 'IDLE' && !activeQuestion && !allSolved && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
            <button 
              onClick={handleShoot}
              className="group relative"
            >
              <div className="absolute inset-0 bg-red-800 rounded-full translate-y-2 group-active:translate-y-1 transition-transform"></div>
              <div className="relative bg-red-500 text-white font-display font-bold text-2xl w-24 h-24 rounded-full shadow-xl border-4 border-red-300 flex items-center justify-center group-active:translate-y-1 transition-transform hover:bg-red-400">
                PULL
              </div>
            </button>
          </div>
        )}

        {/* Victory Screen */}
        {allSolved && (
           <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col text-white animate-fade-in z-40 backdrop-blur-md">
              <div className="text-8xl mb-6">👑</div>
              <h2 className="text-5xl font-display font-bold text-brand-yellow mb-4 drop-shadow-lg">IELTS 9.9 Achieved!</h2>
              <p className="text-3xl mb-8 font-bold">Total Score: {score}</p>
              <p className="text-sm text-green-300 mb-6 font-mono">[Score Saved to System]</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-brand-green px-10 py-4 rounded-full font-bold text-xl hover:bg-green-600 shadow-xl transform hover:scale-105 transition"
              >
                Play Again
              </button>
           </div>
        )}

        {/* Question Modal */}
        {activeQuestion && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border-4 border-brand-blue animate-bounce-slight">
               <h3 className="text-2xl font-bold text-brand-purple mb-4 font-display">Keep the gold!</h3>
               <p className="text-xl font-medium mb-6 text-slate-800">{activeQuestion.question}</p>
               
               <div className="grid grid-cols-1 gap-3">
                 {activeQuestion.options.map((opt, i) => (
                   <button 
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="w-full bg-slate-50 border-2 border-slate-200 hover:border-brand-blue hover:bg-brand-blue hover:text-white font-bold py-3 px-6 rounded-xl transition-all"
                   >
                     {opt}
                   </button>
                 ))}
               </div>
               
               {feedback && (
                 <div className={`mt-6 font-bold text-xl ${feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'}`}>
                   {feedback}
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center text-slate-500 font-medium">
        <p>Big gold = More points (but heavier!). Small gold = Less points (but faster!).</p>
      </div>
    </div>
  );
};
