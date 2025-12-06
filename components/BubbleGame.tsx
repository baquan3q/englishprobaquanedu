
import React, { useState, useEffect, useRef } from 'react';
import { BUBBLE_QUESTIONS } from '../constants';
import { playSound } from '../utils';

interface Bubble {
  id: number;
  text: string;
  isCorrect: boolean;
  x: number; // Percent 0-100
  y: number; // Percent 0-100 (100 is bottom)
  speed: number;
  wobbleOffset: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1.0 down to 0
  color: string;
  size: number;
}

export const BubbleGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(0);
  const [message, setMessage] = useState<string | null>(null); // For "Missed!" alerts
  
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const requestRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const levelRef = useRef(0);
  
  const currentQuestion = BUBBLE_QUESTIONS[level % BUBBLE_QUESTIONS.length];

  // Spawn bubbles for current level
  const spawnBubbles = (lvl: number) => {
    const q = BUBBLE_QUESTIONS[lvl % BUBBLE_QUESTIONS.length];
    const answers = [q.correct, ...q.wrong].sort(() => Math.random() - 0.5);
    
    const newBubbles: Bubble[] = answers.map((ans, i) => ({
      id: Date.now() + i,
      text: ans,
      isCorrect: ans === q.correct,
      x: 10 + (80 / answers.length) * i + (Math.random() * 10),
      y: 110 + (Math.random() * 20), // Start below screen
      speed: 0.15 + (Math.random() * 0.1), // Speed varies
      wobbleOffset: Math.random() * 100,
    }));
    
    setBubbles(newBubbles);
  };

  const startGame = () => {
    setGameState('PLAYING');
    setScore(0);
    setLives(3);
    setLevel(0);
    levelRef.current = 0;
    setMessage(null);
    spawnBubbles(0);
    setParticles([]);
  };

  const createExplosion = (x: number, y: number, isBig: boolean) => {
    const newParticles: Particle[] = [];
    const count = isBig ? 30 : 10;
    const colors = isBig 
      ? ['#FFD700', '#FF4500', '#00BFFF', '#32CD32', '#FFFFFF'] 
      : ['#CCCCCC', '#FFFFFF', '#AAAAAA'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      // Random velocity
      const speed = isBig ? (0.2 + Math.random() * 0.4) : (0.1 + Math.random() * 0.2);
      
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: isBig ? (4 + Math.random() * 6) : (2 + Math.random() * 3)
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const handleBubbleClick = (b: Bubble) => {
    if (gameState !== 'PLAYING') return;

    if (b.isCorrect) {
      createExplosion(b.x, b.y, true); // Big colorful explosion
      playSound('pop');
      playSound('correct');
      setScore(s => s + 20);
      
      // Remove the clicked bubble immediately so it doesn't get clicked again
      setBubbles(prev => prev.filter(bubble => bubble.id !== b.id));

      // Level Up delay
      setTimeout(() => {
        const nextLvl = level + 1;
        setLevel(nextLvl);
        levelRef.current = nextLvl;
        spawnBubbles(nextLvl);
      }, 800);
    } else {
      createExplosion(b.x, b.y, false); // Small puff
      playSound('pop');
      playSound('wrong');
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setGameState('GAMEOVER');
        playSound('gameover');
      } else {
        // Just remove the wrong bubble
        setBubbles(prev => prev.filter(bubble => bubble.id !== b.id));
      }
    }
  };

  // Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const update = (time: number) => {
      if (lastTimeRef.current !== undefined) {
        
        // 1. Update Bubbles
        setBubbles(prevBubbles => {
          const moved = prevBubbles.map(b => ({
            ...b,
            y: b.y - b.speed,
            x: b.x + Math.sin((time / 1000) + b.wobbleOffset) * 0.05
          }));

          // Check if correct bubble went off screen (Loss condition)
          const missedCorrect = moved.some(b => b.isCorrect && b.y < -15);
          
          if (missedCorrect) {
             // Logic: If correct bubble is gone, the level is failed.
             setLives(l => {
               const newL = l - 1;
               if (newL <= 0) {
                 setGameState('GAMEOVER');
                 playSound('gameover');
                 return 0;
               }
               // Respawn level logic handled below in message timeout
               return newL;
             });

             // Show temporary visual feedback
             setMessage("Missed!");
             playSound('wrong');

             // Reset level after short delay
             setTimeout(() => {
                 setMessage(null);
                 if (lives > 1) { // Check livesRef or state carefully, simpler to just force respawn here if not game over
                    spawnBubbles(levelRef.current);
                 }
             }, 1000);

             return []; // Clear bubbles immediately to prevent multiple triggers
          }

          // Filter out bubbles that are too high up (just cleanup)
          return moved.filter(b => b.y > -20);
        });

        // 2. Update Particles (Physics)
        setParticles(prevParticles => {
          return prevParticles
            .map(p => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy, 
              life: p.life - 0.02 // Fade out speed
            }))
            .filter(p => p.life > 0);
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameState, level, lives]);

  return (
    <div className="max-w-4xl mx-auto p-4 select-none h-screen max-h-[700px]">
      <div className="relative w-full h-full bg-gradient-to-b from-sky-400 to-sky-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-sky-600">
        
        {/* Clouds Background */}
        <div className="absolute top-10 left-10 text-white opacity-40 animate-float text-8xl">☁️</div>
        <div className="absolute top-40 right-20 text-white opacity-30 animate-float text-6xl" style={{animationDelay: '2s'}}>☁️</div>
        <div className="absolute bottom-20 left-1/3 text-white opacity-20 animate-float text-9xl" style={{animationDelay: '4s'}}>☁️</div>

        {/* UI HUD */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20">
           <button onClick={onBack} className="bg-white/80 hover:bg-white rounded-full p-2 text-sm font-bold shadow-md">
             ← Exit
           </button>
           
           <div className="bg-white/90 px-6 py-2 rounded-2xl shadow-lg border-2 border-sky-500 min-w-[200px]">
              <h3 className="text-xl font-bold text-sky-700 text-center">{currentQuestion?.question}</h3>
           </div>
           
           <div className="flex flex-col items-end gap-2">
              <div className="bg-amber-400 text-amber-900 px-4 py-1 rounded-full font-bold border-2 border-amber-600">
                 Score: {score}
              </div>
              <div className="flex gap-1">
                 {[...Array(3)].map((_, i) => (
                   <span key={i} className={`text-2xl transition-opacity ${i < lives ? 'opacity-100' : 'opacity-20 grayscale'}`}>❤️</span>
                 ))}
              </div>
           </div>
        </div>

        {/* Message Overlay (e.g. Missed!) */}
        {message && (
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                <div className="text-6xl font-black text-red-500 tracking-tighter drop-shadow-lg animate-bounce-slight border-4 border-red-500 bg-white/80 px-8 py-4 rounded-xl rotate-12">
                    {message}
                </div>
            </div>
        )}

        {/* Start Screen */}
        {gameState === 'START' && (
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-50">
              <h1 className="text-6xl font-display font-bold text-white mb-6 drop-shadow-lg text-center">
                Bubble <span className="text-sky-300">Pop!</span>
              </h1>
              <div className="bg-white p-6 rounded-2xl max-w-md text-center shadow-xl">
                 <p className="text-lg text-slate-600 mb-6">Read the question at the top. Pop the CORRECT bubble before it flies away! If you miss it, you lose a life.</p>
                 <button 
                  onClick={startGame}
                  className="bg-sky-500 text-white text-2xl font-bold px-10 py-4 rounded-full shadow-lg hover:bg-sky-400 transform hover:scale-105 transition-all"
                 >
                   Start Game
                 </button>
              </div>
           </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'GAMEOVER' && (
           <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in">
              <div className="text-8xl mb-4">💥</div>
              <h2 className="text-5xl font-bold text-white mb-2">Game Over!</h2>
              <p className="text-2xl text-sky-200 mb-8 font-bold">Score: {score}</p>
              <button 
                onClick={startGame}
                className="bg-green-500 text-white text-xl font-bold px-8 py-3 rounded-full shadow-lg hover:bg-green-400"
              >
                Try Again
              </button>
           </div>
        )}

        {/* Bubbles */}
        {bubbles.map(b => (
          <div
            key={b.id}
            onClick={() => handleBubbleClick(b)}
            className="absolute cursor-pointer flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-10"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '100px',
              height: '100px',
            }}
          >
             {/* Bubble Graphic */}
             <div className="w-full h-full rounded-full relative bg-gradient-to-tr from-sky-300/40 to-white/60 border border-white/50 shadow-inner backdrop-blur-sm flex items-center justify-center overflow-hidden">
                {/* Shine */}
                <div className="absolute top-4 left-4 w-4 h-2 bg-white/80 rounded-full rotate-45"></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-white/40 rounded-full"></div>
                
                {/* Text */}
                <span className="font-bold text-sky-900 text-lg text-center leading-tight drop-shadow-sm px-2 select-none pointer-events-none">
                  {b.text}
                </span>
             </div>
          </div>
        ))}

        {/* Particles Explosion */}
        {particles.map(p => (
           <div 
             key={p.id}
             className="absolute rounded-full"
             style={{
               left: `${p.x}%`,
               top: `${p.y}%`,
               width: `${p.size}px`,
               height: `${p.size}px`,
               backgroundColor: p.color,
               opacity: p.life,
               transform: `scale(${p.life})`
             }}
           ></div>
        ))}

      </div>
    </div>
  );
};
