

import React, { useState } from 'react';
import { GoldMinerGame } from './GoldMinerGame';
import { BubbleGame } from './BubbleGame';
import { LuckyWheelGame } from './LuckyWheelGame';

type GameType = 'MENU' | 'MINER' | 'BUBBLE' | 'WHEEL';

export const GameZone: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameType>('MENU');

  if (selectedGame === 'MINER') {
    return (
      <div className="relative">
        <button 
          onClick={() => setSelectedGame('MENU')}
          className="absolute top-4 left-4 z-50 bg-white/80 hover:bg-white text-slate-700 px-4 py-2 rounded-full font-bold shadow-md"
        >
          ← Back to Arcade
        </button>
        <GoldMinerGame />
      </div>
    );
  }

  if (selectedGame === 'BUBBLE') {
    return <BubbleGame onBack={() => setSelectedGame('MENU')} />;
  }

  if (selectedGame === 'WHEEL') {
    return <LuckyWheelGame onBack={() => setSelectedGame('MENU')} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-[600px] flex flex-col items-center">
      <div className="text-center mb-10 animate-fade-in-up">
        <h1 className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-4 drop-shadow-sm">
          GAME ZONE
        </h1>
        <p className="text-xl text-slate-500">Choose a game to practice your English!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4">
        
        {/* Card 1: Gold Miner */}
        <div 
          onClick={() => setSelectedGame('MINER')}
          className="group relative bg-white rounded-3xl p-2 shadow-xl cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border-4 border-amber-400"
        >
          <div className="bg-amber-100 rounded-2xl h-64 overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-500">
               🏗️
             </div>
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h3 className="text-3xl font-display font-bold text-white mb-1">Gold Miner</h3>
                <p className="text-amber-200 font-bold">Catch the gold answers!</p>
             </div>
          </div>
          <div className="p-4 flex justify-between items-center">
             <span className="text-slate-500 font-bold">Physics Quiz</span>
             <button className="bg-amber-500 text-white px-6 py-2 rounded-full font-bold group-hover:bg-amber-600 transition">Play</button>
          </div>
        </div>

        {/* Card 2: Bubble Pop */}
        <div 
          onClick={() => setSelectedGame('BUBBLE')}
          className="group relative bg-white rounded-3xl p-2 shadow-xl cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border-4 border-sky-400"
        >
          <div className="bg-sky-100 rounded-2xl h-64 overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-500">
               🫧
             </div>
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h3 className="text-3xl font-display font-bold text-white mb-1">Bubble Pop</h3>
                <p className="text-sky-200 font-bold">Pop the correct words!</p>
             </div>
          </div>
          <div className="p-4 flex justify-between items-center">
             <span className="text-slate-500 font-bold">Reflex Quiz</span>
             <button className="bg-sky-500 text-white px-6 py-2 rounded-full font-bold group-hover:bg-sky-600 transition">Play</button>
          </div>
        </div>

        {/* Card 3: Lucky Wheel */}
        <div 
          onClick={() => setSelectedGame('WHEEL')}
          className="group relative bg-white rounded-3xl p-2 shadow-xl cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border-4 border-pink-400"
        >
          <div className="bg-pink-100 rounded-2xl h-64 overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center text-8xl group-hover:rotate-180 transition-transform duration-700">
               🎡
             </div>
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h3 className="text-3xl font-display font-bold text-white mb-1">Lucky Wheel</h3>
                <p className="text-pink-200 font-bold">Spin with AI Giants!</p>
             </div>
          </div>
          <div className="p-4 flex justify-between items-center">
             <span className="text-slate-500 font-bold">Luck Quiz</span>
             <button className="bg-pink-500 text-white px-6 py-2 rounded-full font-bold group-hover:bg-pink-600 transition">Spin</button>
          </div>
        </div>

      </div>
    </div>
  );
};