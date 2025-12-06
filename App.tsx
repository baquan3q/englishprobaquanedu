
import React, { useState } from 'react';
import { GameSection } from './types';
import { VocabSection } from './components/VocabSection';
import { DialogueSection } from './components/DialogueSection';
import { GameZone } from './components/GameZone';
import { FillBlankGame } from './components/FillBlankGame';
import { AssessmentSection } from './components/AssessmentSection';
import { InteractionRoom } from './components/InteractionRoom';
import { AdminPanel } from './components/AdminPanel'; // Import Admin
import { AiTutor } from './components/AiTutor';

const App = () => {
  const [section, setSection] = useState<GameSection>(GameSection.HOME);

  const renderContent = () => {
    switch (section) {
      case GameSection.VOCAB:
        return <VocabSection />;
      case GameSection.DIALOGUE:
        return <DialogueSection />;
      case GameSection.GAME_ZONE:
        return <GameZone />;
      case GameSection.FILL_BLANK:
        return <FillBlankGame />;
      case GameSection.ASSESSMENT:
        return <AssessmentSection />;
      case GameSection.INTERACTION_ROOM:
        return <InteractionRoom />;
      case GameSection.ADMIN_PANEL:
        return <AdminPanel />;
      default:
        return (
          <div className="max-w-6xl mx-auto p-6 text-center">
            {/* Hero Section */}
            <div className="mb-16 mt-8">
              <span className="inline-block py-1 px-3 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-sm mb-4">
                PREMIUM ENGLISH COURSE - BA QUAN EDUCATION
              </span>
              <h1 className="text-6xl md:text-7xl font-display font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                IELTS 9.9 <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">Cấp Tốc</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
                Master your English skills with our intensive, gamified curriculum. 
                Unit 1 focuses on address, location, and city descriptions.
              </p>
              <button 
                onClick={() => setSection(GameSection.VOCAB)}
                className="bg-brand-purple text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Start Learning Now
              </button>
            </div>
            
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div 
                onClick={() => setSection(GameSection.VOCAB)}
                className="group bg-white p-6 rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-brand-yellow/50 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="text-8xl text-brand-yellow">Aa</div>
                </div>
                <div className="w-14 h-14 bg-brand-yellow/20 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  📚
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 text-left">Vocabulary</h3>
                <p className="text-slate-500 text-sm text-left">Master key terms with interactive flashcards.</p>
              </div>

              <div 
                onClick={() => setSection(GameSection.DIALOGUE)}
                className="group bg-white p-6 rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-brand-green/50 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <div className="text-8xl text-brand-green">""</div>
                </div>
                <div className="w-14 h-14 bg-brand-green/20 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  🎧
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 text-left">Conversation</h3>
                <p className="text-slate-500 text-sm text-left">Dialogue practice with audio playback.</p>
              </div>

              <div 
                onClick={() => setSection(GameSection.GAME_ZONE)}
                className="group bg-white p-6 rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-brand-blue/50 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <div className="text-8xl text-brand-blue">?</div>
                </div>
                <div className="w-14 h-14 bg-brand-blue/20 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  🎮
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 text-left">Game Zone</h3>
                <p className="text-slate-500 text-sm text-left">Play Gold Miner & Bubble Pop!</p>
              </div>

              <div 
                onClick={() => setSection(GameSection.FILL_BLANK)}
                className="group bg-white p-6 rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-brand-pink/50 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <div className="text-8xl text-brand-pink">_</div>
                </div>
                <div className="w-14 h-14 bg-brand-pink/20 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  📝
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 text-left">Writing Skill</h3>
                <p className="text-slate-500 text-sm text-left">Sentence structure gap-fill exercises.</p>
              </div>

              <div 
                onClick={() => setSection(GameSection.ASSESSMENT)}
                className="group bg-white p-6 rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-red-500/50 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <div className="text-8xl text-red-500">A+</div>
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  📝
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 text-left">Assessment</h3>
                <p className="text-slate-500 text-sm text-left">15-minute test to check your level.</p>
              </div>

              <div 
                onClick={() => setSection(GameSection.INTERACTION_ROOM)}
                className="group bg-slate-900 p-6 rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all border border-slate-700 hover:border-cyan-400 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <div className="text-8xl text-cyan-400">@</div>
                </div>
                <div className="w-14 h-14 bg-cyan-900 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  💬
                </div>
                <h3 className="text-xl font-bold text-cyan-400 mb-2 text-left">Virtual Room</h3>
                <p className="text-slate-400 text-sm text-left">Live class discussion & interaction.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="font-sans text-slate-800">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-panel border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Left: Brand Name */}
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => setSection(GameSection.HOME)}
            >
              <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3 shadow-lg group-hover:rotate-12 transition-transform">
                9.9
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl leading-none">IELTS</span>
                <span className="text-xs font-bold text-slate-400 tracking-widest">EXPRESS</span>
              </div>
            </div>
            
            {/* Middle: Navigation Links */}
            <div className="hidden xl:flex space-x-1">
              {[
                { id: GameSection.VOCAB, label: 'Vocabulary' },
                { id: GameSection.DIALOGUE, label: 'Conversation' },
                { id: GameSection.GAME_ZONE, label: 'Game Zone' },
                { id: GameSection.FILL_BLANK, label: 'Writing' },
                { id: GameSection.ASSESSMENT, label: 'Test' },
                { id: GameSection.INTERACTION_ROOM, label: 'Virtual Room' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`px-3 py-2 rounded-full text-sm font-bold transition-all ${
                    section === item.id 
                      ? 'bg-brand-purple text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right: BA QUAN EDUCATION Branding & Logo */}
            <div className="flex items-center gap-3 ml-2">
               {/* Admin Button (Hidden gear icon) */}
               <button 
                 onClick={() => setSection(GameSection.ADMIN_PANEL)}
                 className="text-slate-300 hover:text-slate-500 p-2 transition-colors"
                 title="Teacher Login"
               >
                 ⚙️
               </button>

               <div className="hidden md:flex flex-col items-end">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Powered By</span>
                  <span className="text-sm font-display font-bold text-brand-purple leading-none">BA QUAN EDUCATION</span>
               </div>
               
               {/* Logo Image with Error Handling */}
               <div className="w-12 h-12 rounded-full border-2 border-brand-purple bg-white p-0.5 shadow-sm overflow-hidden flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/100x100/7209B7/white?text=BQ"; // Fallback to text if logo.png not found
                    }}
                    alt="Ba Quan Education" 
                    className="w-full h-full object-cover rounded-full"
                  />
               </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)]">
        {renderContent()}
      </main>

      {/* Compact Footer */}
      <footer className="bg-white border-t py-4">
        <div className="max-w-6xl mx-auto px-6 text-center">
           <div className="mb-2 flex justify-center items-center gap-2 font-display font-bold text-lg text-brand-purple">
             <span>IELTS 9.9 Cấp Tốc - BA QUAN EDUCATION</span>
           </div>
           
           <div className="flex flex-wrap justify-center gap-3 mb-2">
             <a 
               href="https://www.facebook.com/buianhquan06" 
               target="_blank" 
               rel="noreferrer"
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700 transition-all hover:scale-105 shadow-sm group"
             >
                <svg className="w-3 h-3 fill-current group-hover:animate-bounce-slight" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
             </a>
             <a 
               href="https://zalo.me/SODIENTHOAI" 
               target="_blank" 
               rel="noreferrer"
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500 text-white text-[10px] font-bold hover:bg-blue-600 transition-all hover:scale-105 shadow-sm group"
             >
                <div className="w-3 h-3 bg-white text-blue-500 rounded font-black flex items-center justify-center text-[7px] group-hover:animate-spin">Z</div>
                Zalo
             </a>
             <a 
               href="https://beacons.ai/baquan3q" 
               target="_blank" 
               rel="noreferrer"
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white text-[10px] font-bold hover:opacity-90 transition-all hover:scale-105 shadow-sm"
             >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                Beacons
             </a>
           </div>

           <p className="text-slate-300 text-[9px]">
             © 2024 BA QUAN EDUCATION. All rights reserved.
           </p>
        </div>
      </footer>

      {/* AI Tutor */}
      <AiTutor />
    </div>
  );
};

export default App;
