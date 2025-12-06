
import React, { useState } from 'react';
import { VocabWord } from '../types';
import { VOCAB_LIST } from '../constants';
import { playSound } from '../utils';

// --- SUB-COMPONENTS ---

const FlashCard: React.FC<{ item: VocabWord }> = ({ item }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(item.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div 
      className="group perspective-1000 w-full h-64 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''} shadow-xl rounded-2xl`}>
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl border-4 border-brand-blue flex flex-col items-center justify-center p-4">
          <div className="text-sm font-bold text-gray-400 mb-2">Word</div>
          <h3 className="text-4xl font-display font-bold text-brand-purple mb-2">{item.word}</h3>
          <p className="text-xl text-gray-500 font-mono mb-6">{item.ipa}</p>
          <button 
            onClick={playAudio}
            className="mt-2 bg-brand-yellow text-brand-purple px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors flex items-center gap-2 shadow-sm z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Listen
          </button>
          <p className="absolute bottom-4 text-xs text-gray-400">Click to flip</p>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-brand-purple rounded-2xl border-4 border-brand-purple flex flex-col items-center justify-center p-4 text-white">
          <div className="text-sm font-bold text-brand-yellow mb-2">Meaning</div>
          <h3 className="text-3xl font-display font-bold">{item.meaning}</h3>
        </div>
      </div>
    </div>
  );
};

const QuizGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // Generate Questions based on VOCAB_LIST
  // Each question is a random word, with 1 correct meaning + 3 wrong meanings
  const [questions] = useState(() => {
    return [...VOCAB_LIST].sort(() => Math.random() - 0.5).map(target => {
      const distractors = VOCAB_LIST
        .filter(w => w.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaning);
      
      const options = [target.meaning, ...distractors].sort(() => Math.random() - 0.5);
      return { target, options };
    });
  });

  const handleAnswer = (selectedMeaning: string) => {
    if (feedback !== 'none') return; // Prevent double click

    const currentQ = questions[currentIdx];
    if (selectedMeaning === currentQ.target.meaning) {
      playSound('correct');
      setFeedback('correct');
      setScore(s => s + 10);
    } else {
      playSound('wrong');
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback('none');
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1);
      } else {
        playSound('win');
        setIsFinished(true);
      }
    }, 1200);
  };

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto text-center p-10 bg-white rounded-3xl shadow-xl border-4 border-brand-green animate-bounce-slight">
        <h2 className="text-4xl font-bold text-brand-purple mb-4">Quiz Complete!</h2>
        <div className="text-6xl mb-6">🏆</div>
        <p className="text-2xl text-slate-700 mb-8">Your Score: <span className="font-bold text-brand-green">{score}</span> / {questions.length * 10}</p>
        <div className="flex justify-center gap-4">
          <button onClick={onBack} className="bg-gray-200 text-slate-700 px-6 py-3 rounded-full font-bold hover:bg-gray-300">Back to Learn</button>
          <button onClick={() => window.location.reload()} className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600">Retry</button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex justify-between items-center mb-6">
         <span className="font-bold text-slate-400">Question {currentIdx + 1} / {questions.length}</span>
         <span className="font-bold text-brand-purple text-xl">Score: {score}</span>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-brand-purple relative overflow-hidden">
        {feedback === 'correct' && <div className="absolute inset-0 bg-green-100/80 flex items-center justify-center z-10 text-6xl animate-ping">✅</div>}
        {feedback === 'wrong' && <div className="absolute inset-0 bg-red-100/80 flex items-center justify-center z-10 text-6xl animate-ping">❌</div>}

        <div className="text-center mb-8">
          <p className="text-sm text-slate-500 uppercase tracking-wide font-bold mb-2">What is the meaning of:</p>
          <h2 className="text-5xl font-display font-bold text-brand-blue mb-2">{q.target.word}</h2>
          <p className="text-gray-400 font-mono">{q.target.ipa}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-brand-purple hover:bg-purple-50 transition-all font-bold text-lg text-slate-700 group"
            >
              <span className="inline-block w-8 h-8 bg-slate-200 rounded-full text-center leading-8 mr-3 text-sm group-hover:bg-brand-purple group-hover:text-white transition-colors">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN VOCAB SECTION ---

export const VocabSection: React.FC = () => {
  const [mode, setMode] = useState<'LEARN' | 'REVIEW'>('LEARN');

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Tab Switcher */}
      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={() => setMode('LEARN')}
          className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${mode === 'LEARN' ? 'bg-brand-purple text-white shadow-lg scale-105' : 'bg-white text-slate-500 hover:bg-gray-100'}`}
        >
          📖 Learn Flashcards
        </button>
        <button 
          onClick={() => setMode('REVIEW')}
          className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${mode === 'REVIEW' ? 'bg-brand-pink text-white shadow-lg scale-105' : 'bg-white text-slate-500 hover:bg-gray-100'}`}
        >
          📝 Review Quiz
        </button>
      </div>

      {mode === 'LEARN' ? (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-display font-bold text-brand-purple mb-2">Vocabulary List</h2>
            <p className="text-lg text-gray-600">Click a card to see the meaning. Press the volume icon to listen.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {VOCAB_LIST.map((word) => (
              <FlashCard key={word.id} item={word} />
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <QuizGame onBack={() => setMode('LEARN')} />
        </div>
      )}
    </div>
  );
};
