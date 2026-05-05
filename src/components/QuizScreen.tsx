import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Clock, Heart } from 'lucide-react';
import { Question, Topic } from '../types';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

interface QuizScreenProps {
  questions: Question[];
  onComplete: (results: Record<Topic, { total: number; correct: number }>, timeSpent: number) => void;
  onQuit: () => void;
}

export function QuizScreen({ questions, onComplete, onQuit }: QuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hearts, setHearts] = useState(5);
  
  const [stats, setStats] = useState<Record<Topic, { total: number; correct: number }>>({
    'Basics': { total: 0, correct: 0 },
    'Functions': { total: 0, correct: 0 },
    'Pointers': { total: 0, correct: 0 },
    'Records': { total: 0, correct: 0 },
    'Files': { total: 0, correct: 0 },
  });

  const question = questions[currentIndex] || questions[0];
  const progress = ((currentIndex) / questions.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleCheck = () => {
    let isCorrect = false;

    if (question.type === 'text') {
      if (!textAnswer.trim()) return;
      const answers = Array.isArray(question.correctTextAnswer) 
        ? question.correctTextAnswer 
        : [question.correctTextAnswer || ''];
      
      isCorrect = answers.some(ans => ans.toLowerCase() === textAnswer.trim().toLowerCase());
    } else {
      if (selectedOption === null) return;
      isCorrect = selectedOption === question.correctAnswer;
    }
    
    setIsAnswered(true);
    
    setStats(prev => ({
      ...prev,
      [question.topic]: {
        total: (prev[question.topic]?.total || 0) + 1,
        correct: (prev[question.topic]?.correct || 0) + (isCorrect ? 1 : 0)
      }
    }));

    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#a855f7', '#9333ea', '#c084fc'] // Purple confetti
      });
    } else {
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (hearts === 0) {
      onComplete(stats, timeSpent);
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTextAnswer('');
      setIsAnswered(false);
    } else {
      onComplete(stats, timeSpent);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isCurrentTextCorrect = () => {
    if (!textAnswer.trim()) return false;
    const answers = Array.isArray(question.correctTextAnswer) 
      ? question.correctTextAnswer 
      : [question.correctTextAnswer || ''];
    return answers.some(ans => ans.toLowerCase() === textAnswer.trim().toLowerCase());
  };

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto px-4 py-6 font-sans">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onQuit} className="text-gray-400 hover:text-gray-600">
          <X className="w-8 h-8" />
        </button>
        
        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-purple-500 rounded-full transition-all duration-300 ease-out relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          >
            <div className="absolute top-1 left-2 right-2 h-1 bg-white/30 rounded-full"></div>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 text-red-500 font-black text-xl">
          <Heart className="w-6 h-6 fill-current" />
          <span>{hearts}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 text-gray-400 font-black tracking-wider uppercase text-sm">
        <span className="bg-gray-100 px-3 py-1 rounded-lg">
          {question.topic}
        </span>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-mono text-lg text-gray-500">{formatTime(timeSpent)}</span>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-col mb-8">
          <h2 className="text-3xl font-black leading-tight text-[#4B4B4B] flex items-start gap-3">
             {question.visual && <span className="text-4xl">{question.visual}</span>}
             {question.text}
          </h2>
        </div>

        {question.codeSnippet && (
          <div className="bg-slate-800 text-slate-50 p-4 rounded-2xl mb-8 font-mono text-sm overflow-x-auto shadow-inner">
            <pre><code>{question.codeSnippet}</code></pre>
          </div>
        )}

        <div className="space-y-4">
          {question.type === 'text' ? (
            <div className="mt-4">
              <input 
                type="text" 
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                disabled={isAnswered}
                placeholder="Type your code/answer here..."
                className={cn(
                  "w-full p-6 rounded-2xl border-2 border-b-4 font-mono font-bold text-xl transition-all outline-none",
                  isAnswered
                    ? isCurrentTextCorrect()
                      ? "border-[#58CC02] bg-[#58CC02]/10 text-[#46A302]"
                      : "border-red-500 bg-red-50 text-red-600"
                    : "border-gray-200 focus:border-purple-500 focus:border-b-purple-500 bg-white text-[#4B4B4B]"
                )}
              />
              {isAnswered && (
                <div className="mt-4 p-5 bg-purple-50 border-2 border-purple-200 rounded-2xl flex items-start gap-4">
                  <div className="text-3xl">💡</div>
                  <div>
                    <h4 className="font-black text-purple-700 text-xs uppercase tracking-widest mb-1 opacity-80">Explanation</h4>
                    <p className="font-bold text-purple-800 text-lg leading-relaxed">{question.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            question.options?.map((option, index) => {
              const isSelected = selectedOption === index;
              let optionStateClass = "border-gray-200 hover:bg-purple-50 hover:border-purple-300 group-hover:text-purple-600";
              let indexStateClass = "border-gray-200 text-gray-400 group-hover:border-purple-300 group-hover:text-purple-600";
              
              if (isAnswered) {
                if (index === question.correctAnswer) {
                  optionStateClass = "border-[#58CC02] bg-[#58CC02]/10 text-[#46A302]";
                  indexStateClass = "border-[#58CC02] bg-[#58CC02] text-white";
                } else if (isSelected) {
                  optionStateClass = "border-red-500 bg-red-50 text-red-600";
                  indexStateClass = "border-red-500 bg-red-500 text-white";
                } else {
                   optionStateClass = "border-gray-200 text-gray-400 opacity-50";
                   indexStateClass = "border-gray-200 text-gray-400";
                }
              } else if (isSelected) {
                optionStateClass = "border-purple-500 bg-purple-50 text-purple-600";
                indexStateClass = "border-purple-500 bg-purple-500 text-white";
              }

              return (
                <motion.button
                  key={index}
                  whileHover={!isAnswered ? { y: -2 } : {}}
                  whileTap={!isAnswered ? { y: 2 } : {}}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isAnswered}
                  className={cn(
                    "group w-full flex items-center gap-4 p-4 border-2 border-b-4 rounded-2xl transition-all text-left",
                    optionStateClass,
                    (isAnswered && !isSelected && index !== question.correctAnswer) && "translate-y-[4px] border-b-2" 
                  )}
                >
                  <div className={cn("w-10 h-10 border-2 rounded-lg flex items-center justify-center font-black transition-colors shrink-0", indexStateClass)}>
                    {index + 1}
                  </div>
                  <code className="font-mono font-bold text-lg leading-relaxed flex-1 whitespace-pre-wrap">{option}</code>
                  
                  {isAnswered && index === question.correctAnswer && <Check className="w-6 h-6 shrink-0" />}
                  {isAnswered && isSelected && index !== question.correctAnswer && <X className="w-6 h-6 shrink-0" />}
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      <AnimatePresence>
        {isAnswered && question.type !== 'text' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 p-6 border-t-2",
               selectedOption === question.correctAnswer ? "border-[#58CC02]/20 bg-[#58CC02]/5" : "border-red-200 bg-red-50"
            )}
          >
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className={cn(
                  "font-black text-2xl mb-1 flex items-center gap-2",
                  selectedOption === question.correctAnswer ? "text-[#58CC02]" : "text-red-500"
                )}>
                  {selectedOption === question.correctAnswer ? (
                    <><Check className="w-8 h-8" strokeWidth={3} /> Excellent!</>
                  ) : (
                    <><X className="w-8 h-8" strokeWidth={3} /> Incorrect</>
                  )}
                </div>
                <div className="mt-4 p-4 bg-white/60 border-2 border-white rounded-2xl flex items-start gap-4">
                  <div className="text-3xl">💡</div>
                  <div>
                    <h4 className="font-black text-purple-700 text-xs uppercase tracking-widest mb-1 opacity-80">Explanation</h4>
                    <p className={cn(
                      "text-lg font-bold leading-relaxed",
                      selectedOption === question.correctAnswer ? "text-[#46A302]" : "text-red-700"
                    )}>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ filter: 'brightness(1.05)' }}
                whileTap={{ y: 4 }}
                onClick={handleNext}
                className={cn(
                  "w-full sm:w-auto px-12 py-4 rounded-2xl font-black text-xl text-white uppercase tracking-widest transition-all",
                  selectedOption === question.correctAnswer 
                    ? "bg-[#58CC02] border-b-4 border-[#46A302]" 
                    : "bg-red-500 border-b-4 border-red-600"
                )}
              >
                {hearts === 0 ? "FINISH" : "CONTINUE"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-40" />

      {(!isAnswered || question.type === 'text') && (
         <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t-2 border-gray-100 z-10">
           <div className="max-w-2xl mx-auto flex justify-between items-center gap-4">
            <button 
              className={cn("px-8 py-4 border-2 border-gray-200 border-b-4 rounded-2xl font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 flex-shrink-0 transition-all", isAnswered && "opacity-0 pointer-events-none")} 
              onClick={handleNext}
            >
              Skip
            </button>
            <button
              onClick={isAnswered ? handleNext : handleCheck}
              disabled={!isAnswered && (question.type === 'text' ? !textAnswer.trim() : selectedOption === null)}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-xl uppercase tracking-widest transition-all",
                (isAnswered || (question.type === 'text' ? textAnswer.trim() : selectedOption !== null))
                  ? "bg-purple-500 text-white border-b-4 border-purple-700 hover:brightness-105 active:border-b-0 active:translate-y-[4px]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed border-b-4 border-gray-300"
              )}
            >
              {isAnswered ? 'CONTINUE' : 'Check Answer'}
            </button>
           </div>
         </div>
      )}
    </div>
  );
}
