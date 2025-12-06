
import React, { useState, useEffect, useRef } from 'react';
import { ASSESSMENT_QUESTIONS } from '../constants';
import { playSound } from '../utils';
import { saveScoreToDatabase } from '../services/api';

const TIME_PER_PART = 300; // 5 minutes per part

type TestStage = 'INTRO' | 'PART1_TEST' | 'PART1_RESULT' | 'PART2_TEST' | 'FINAL_RESULT';

export const AssessmentSection: React.FC = () => {
  const [stage, setStage] = useState<TestStage>('INTRO');
  
  // Navigation within a part
  const [currentIdx, setCurrentIdx] = useState(0); 
  
  // Data
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [timeLeft, setTimeLeft] = useState(TIME_PER_PART);
  
  // Scoring
  const [scorePart1, setScorePart1] = useState(0);
  const [scorePart2, setScorePart2] = useState(0);

  const timerRef = useRef<number | undefined>(undefined);
  const scoreSavedRef = useRef(false);

  // Helper to get questions for current active part
  const getCurrentQuestions = () => {
    if (stage === 'PART1_TEST' || stage === 'PART1_RESULT') {
      return ASSESSMENT_QUESTIONS.filter(q => q.part === 1);
    }
    if (stage === 'PART2_TEST' || stage === 'FINAL_RESULT') {
      return ASSESSMENT_QUESTIONS.filter(q => q.part === 2);
    }
    return [];
  };

  const currentQuestions = getCurrentQuestions();

  // Timer Logic
  useEffect(() => {
    if (stage === 'PART1_TEST' || stage === 'PART2_TEST') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  // Save Score Logic when Final Result is reached
  useEffect(() => {
    if (stage === 'FINAL_RESULT' && !scoreSavedRef.current) {
       scoreSavedRef.current = true;
       const finalScore = (scorePart1 + scorePart2) / 20 * 10;
       const username = localStorage.getItem('virtual_user') || 'Anonymous Student';
       saveScoreToDatabase(username, 'ASSESSMENT_TEST', finalScore);
    }
  }, [stage, scorePart1, scorePart2]);

  const handleAutoSubmit = () => {
    if (stage === 'PART1_TEST') submitPart1();
    if (stage === 'PART2_TEST') submitPart2();
  };

  const startPart1 = () => {
    setStage('PART1_TEST');
    setTimeLeft(TIME_PER_PART);
    setCurrentIdx(0);
    setUserAnswers({}); 
    scoreSavedRef.current = false;
    playSound('click');
  };

  const startPart2 = () => {
    setStage('PART2_TEST');
    setTimeLeft(TIME_PER_PART);
    setCurrentIdx(0);
    playSound('click');
  };

  const restartAll = () => {
    setStage('INTRO');
    setUserAnswers({});
    setScorePart1(0);
    setScorePart2(0);
    scoreSavedRef.current = false;
  };

  const handleSelect = (questionId: number, option: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
    playSound('click');
  };

  const submitPart1 = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Calculate P1 Score
    const p1Questions = ASSESSMENT_QUESTIONS.filter(q => q.part === 1);
    let correct = 0;
    p1Questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) correct++;
    });
    setScorePart1(correct); 
    
    playSound(correct >= 5 ? 'correct' : 'wrong');
    setStage('PART1_RESULT');
  };

  const submitPart2 = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate P2 Score
    const p2Questions = ASSESSMENT_QUESTIONS.filter(q => q.part === 2);
    let correct = 0;
    p2Questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) correct++;
    });
    setScorePart2(correct);

    playSound('win');
    setStage('FINAL_RESULT');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- RENDER FUNCTIONS ---

  // 1. INTRO
  if (stage === 'INTRO') {
    return (
      <div className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-[500px]">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center border-t-8 border-brand-purple max-w-2xl w-full">
          <div className="text-8xl mb-6 animate-bounce-slight">📝</div>
          <h1 className="text-4xl font-display font-bold text-brand-purple mb-4">Competency Assessment</h1>
          <p className="text-lg text-slate-500 mb-8">
            The exam consists of 2 separate parts.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left max-w-lg mx-auto">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📚</span>
                <strong className="text-brand-blue">Part 1: Vocabulary</strong>
              </div>
              <ul className="text-sm text-slate-600 list-disc list-inside">
                <li>10 Questions</li>
                <li>Time: 5 Minutes</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">✍️</span>
                <strong className="text-green-600">Part 2: Sentences</strong>
              </div>
              <ul className="text-sm text-slate-600 list-disc list-inside">
                <li>10 Questions</li>
                <li>Time: 5 Minutes</li>
              </ul>
            </div>
          </div>

          <button 
            onClick={startPart1}
            className="bg-brand-purple text-white text-xl font-bold px-12 py-4 rounded-full shadow-lg hover:bg-purple-600 hover:scale-105 transition-all"
          >
            Start Part 1
          </button>
        </div>
      </div>
    );
  }

  // 2. TESTING INTERFACE (Shared for P1 & P2)
  if (stage === 'PART1_TEST' || stage === 'PART2_TEST') {
    const q = currentQuestions[currentIdx];
    const progress = ((currentIdx + 1) / currentQuestions.length) * 100;
    const partTitle = stage === 'PART1_TEST' ? 'PART 1: VOCABULARY' : 'PART 2: SENTENCES';
    const partColor = stage === 'PART1_TEST' ? 'text-brand-blue' : 'text-green-600';
    const partBg = stage === 'PART1_TEST' ? 'bg-blue-50' : 'bg-green-50';

    return (
      <div className="max-w-3xl mx-auto p-4">
        {/* Sticky Header with Timer */}
        <div className="sticky top-[85px] z-30 bg-white/90 backdrop-blur shadow-md rounded-2xl p-4 mb-6 flex justify-between items-center border border-slate-200">
          <div className="flex items-center gap-3">
             <div className={`px-3 py-1 rounded-lg font-bold text-xs ${partBg} ${partColor}`}>
                {stage === 'PART1_TEST' ? 'PART 1' : 'PART 2'}
             </div>
             <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <div className={`text-2xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                  {formatTime(timeLeft)}
                </div>
             </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-xs font-bold text-slate-400 uppercase">Question</span>
             <span className="text-xl font-bold text-brand-purple">{currentIdx + 1}<span className="text-slate-400 text-sm">/{currentQuestions.length}</span></span>
          </div>
        </div>

        <div className="mb-4">
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full transition-all duration-300 ${stage === 'PART1_TEST' ? 'bg-brand-blue' : 'bg-green-500'}`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 min-h-[400px] flex flex-col relative overflow-hidden animate-fade-in">
          <div className={`inline-block px-3 py-1 rounded-full ${partBg} ${partColor} font-bold text-xs mb-4 self-start`}>
            {partTitle}
          </div>
          
          <h2 className="text-2xl font-display font-bold text-slate-800 mb-8">{q.question}</h2>

          <div className="space-y-3 mb-8">
            {q.options.map((opt, i) => {
              const active = userAnswers[q.id] === opt;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(q.id, opt)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex items-center group
                    ${active 
                      ? 'border-brand-purple bg-purple-50 text-brand-purple shadow-md' 
                      : 'border-slate-100 bg-white text-slate-600 hover:border-brand-blue hover:bg-blue-50'}
                  `}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0
                    ${active ? 'border-brand-purple bg-brand-purple' : 'border-slate-300 group-hover:border-brand-blue'}
                  `}>
                    {active && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  {opt}
                </button>
              )
            })}
          </div>

          <div className="mt-auto flex justify-between pt-6 border-t border-slate-100">
            <button 
              onClick={() => setCurrentIdx(c => c - 1)}
              disabled={currentIdx === 0}
              className="px-6 py-2 rounded-full font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ← Previous
            </button>

            {currentIdx === currentQuestions.length - 1 ? (
               <button 
                 onClick={stage === 'PART1_TEST' ? submitPart1 : submitPart2}
                 className="px-8 py-3 rounded-full font-bold bg-green-500 text-white hover:bg-green-600 shadow-lg transform hover:-translate-y-1 transition-all"
               >
                 Submit {stage === 'PART1_TEST' ? 'Part 1' : 'Part 2'}
               </button>
            ) : (
              <button 
                onClick={() => setCurrentIdx(c => c + 1)}
                className="px-6 py-2 rounded-full font-bold bg-brand-blue text-white hover:bg-blue-500 shadow-md"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. PART 1 RESULT
  if (stage === 'PART1_RESULT') {
    const p1Questions = ASSESSMENT_QUESTIONS.filter(q => q.part === 1);
    
    return (
      <div className="max-w-4xl mx-auto p-4 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border-t-8 border-brand-blue">
          <div className="p-8 text-center bg-blue-50">
             <h2 className="text-3xl font-display font-bold text-brand-blue mb-4">Part 1 Complete!</h2>
             <div className="text-6xl mb-4">
               {scorePart1 >= 8 ? '🎉' : scorePart1 >= 5 ? '👍' : '📚'}
             </div>
             <p className="text-xl text-slate-600 mb-6">
               You scored <span className="font-bold text-3xl text-brand-blue">{scorePart1}/10</span> in Vocabulary.
             </p>
             <button 
               onClick={startPart2}
               className="bg-brand-purple text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-purple-600 transform hover:scale-105 transition-all animate-bounce-slight"
             >
               Start Part 2 (Sentences) →
             </button>
          </div>
        </div>

        {/* Review Part 1 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200">
           <h3 className="text-xl font-bold text-slate-700 mb-6 border-b pb-2">Review Part 1 Answers</h3>
           <div className="space-y-6">
             {p1Questions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                return (
                   <div key={q.id} className={`p-4 rounded-xl border-l-4 bg-slate-50 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                      <div className="flex justify-between items-start mb-2">
                         <span className="font-bold text-slate-400 text-xs">QUESTION {idx + 1}</span>
                         {!isCorrect && <span className="text-red-500 font-bold text-xs">INCORRECT</span>}
                         {isCorrect && <span className="text-green-500 font-bold text-xs">CORRECT</span>}
                      </div>
                      <p className="font-bold text-slate-800 mb-2">{q.question}</p>
                      
                      {!isCorrect && (
                        <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                           <div className="bg-red-50 p-2 rounded border border-red-100">
                             <span className="block text-red-400 font-bold text-xs">YOUR ANSWER</span>
                             <span className="text-red-700 font-medium">{userAns || '(No Answer)'}</span>
                           </div>
                           <div className="bg-green-50 p-2 rounded border border-green-100">
                             <span className="block text-green-600 font-bold text-xs">CORRECT ANSWER</span>
                             <span className="text-green-800 font-bold">{q.correctAnswer}</span>
                           </div>
                        </div>
                      )}
                      
                      <div className="mt-2 text-sm text-slate-500 bg-white p-2 rounded border border-slate-100 italic">
                         💡 {q.explanation}
                      </div>
                   </div>
                );
             })}
           </div>
        </div>
      </div>
    );
  }

  // 4. FINAL RESULT (Part 2 + Total)
  if (stage === 'FINAL_RESULT') {
    const p2Questions = ASSESSMENT_QUESTIONS.filter(q => q.part === 2);
    const finalScore = (scorePart1 + scorePart2) / 20 * 10; // Scale to 10

    return (
      <div className="max-w-5xl mx-auto p-4 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-t-8 border-brand-purple mb-8">
          <div className="p-8 text-center bg-gradient-to-b from-purple-50 to-white">
             <h2 className="text-4xl font-display font-bold text-brand-purple mb-2">Exam Completed!</h2>
             <p className="text-slate-500 mb-8">Here is your final performance report.</p>

             <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
                {/* Total Score */}
                <div className="relative">
                   <div className="w-40 h-40 rounded-full border-8 border-brand-purple flex items-center justify-center bg-white shadow-2xl">
                      <div className="flex flex-col">
                        <span className="text-6xl font-bold text-brand-purple">{finalScore}</span>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Scale 10</span>
                      </div>
                   </div>
                   {finalScore >= 9 && <div className="absolute -top-2 -right-2 text-4xl animate-bounce">👑</div>}
                </div>

                {/* Breakdown */}
                <div className="w-full max-w-xs space-y-3">
                   <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <span className="font-bold text-slate-500">Part 1: Vocab</span>
                      <span className={`font-bold text-lg ${scorePart1 >= 8 ? 'text-green-500' : 'text-slate-700'}`}>{scorePart1}/10</span>
                   </div>
                   <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <span className="font-bold text-slate-500">Part 2: Sentences</span>
                      <span className={`font-bold text-lg ${scorePart2 >= 8 ? 'text-green-500' : 'text-slate-700'}`}>{scorePart2}/10</span>
                   </div>
                </div>
             </div>

             <div className="text-sm text-green-600 font-mono mb-4 bg-green-50 inline-block px-3 py-1 rounded-full">
               ✓ Results automatically saved to system
             </div>

             <div className="flex justify-center gap-4">
               <button 
                  onClick={restartAll}
                  className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold hover:bg-black shadow-lg"
               >
                  Retake Full Exam
               </button>
             </div>
          </div>
        </div>

        {/* Review Part 2 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200">
           <h3 className="text-xl font-bold text-slate-700 mb-6 border-b pb-2">Review Part 2 Answers</h3>
           <div className="space-y-6">
             {p2Questions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                return (
                   <div key={q.id} className={`p-4 rounded-xl border-l-4 bg-slate-50 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                      <div className="flex justify-between items-start mb-2">
                         <span className="font-bold text-slate-400 text-xs">QUESTION {idx + 1}</span>
                         {!isCorrect && <span className="text-red-500 font-bold text-xs">INCORRECT</span>}
                         {isCorrect && <span className="text-green-500 font-bold text-xs">CORRECT</span>}
                      </div>
                      <p className="font-bold text-slate-800 mb-2">{q.question}</p>
                      
                      {!isCorrect && (
                        <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                           <div className="bg-red-50 p-2 rounded border border-red-100">
                             <span className="block text-red-400 font-bold text-xs">YOUR ANSWER</span>
                             <span className="text-red-700 font-medium">{userAns || '(No Answer)'}</span>
                           </div>
                           <div className="bg-green-50 p-2 rounded border border-green-100">
                             <span className="block text-green-600 font-bold text-xs">CORRECT ANSWER</span>
                             <span className="text-green-800 font-bold">{q.correctAnswer}</span>
                           </div>
                        </div>
                      )}
                      
                      <div className="mt-2 text-sm text-slate-500 bg-white p-2 rounded border border-slate-100 italic">
                         💡 {q.explanation}
                      </div>
                   </div>
                );
             })}
           </div>
        </div>
      </div>
    );
  }

  return null;
};
