import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Topic } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ArrowRight, RotateCcw, Trophy, Target } from 'lucide-react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

interface ResultsScreenProps {
  user: { fullName: string; matricule: string };
  stats: Record<Topic, { total: number; correct: number }>;
  timeSpent: number;
  onHome: () => void;
  onLeaderboard: () => void;
}

export function ResultsScreen({ user, stats, timeSpent, onHome, onLeaderboard }: ResultsScreenProps) {
  const [saved, setSaved] = useState(false);

  // Trigger confetti on mount
  React.useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const totalQuestions = Object.values(stats).reduce((acc, curr) => acc + curr.total, 0);
  const totalCorrect = Object.values(stats).reduce((acc, curr) => acc + curr.correct, 0);
  const scorePercentage = Math.round((totalCorrect / Math.max(totalQuestions, 1)) * 100);

  const chartData = useMemo(() => {
    return Object.entries(stats).map(([topic, data]) => ({
      subject: topic,
      score: data.total > 0 ? (data.correct / data.total) * 100 : 0,
      fullMark: 100,
    }));
  }, [stats]);

  const getWeakestTopic = () => {
    let weakest = 'None';
    let lowestScore = 101;
    Object.entries(stats).forEach(([topic, data]) => {
      if (data.total > 0) {
        const p = data.correct / data.total;
        if (p < lowestScore) {
          lowestScore = p;
          weakest = topic;
        }
      }
    });
    return { topic: weakest, score: Math.round(lowestScore * 100) };
  };

  const weakest = getWeakestTopic();

  const handleSaveScore = () => {
    const newEntry = {
      id: Math.random().toString(36).substring(7),
      name: user.fullName,
      matricule: user.matricule,
      score: scorePercentage,
      timeSpent,
      date: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('c_master_leaderboard') || '[]');
    existing.push(newEntry);
    existing.sort((a: any, b: any) => b.score - a.score || a.timeSpent - b.timeSpent);
    localStorage.setItem('c_master_leaderboard', JSON.stringify(existing.slice(0, 50))); // Keep top 50
    
    setSaved(true);
    onLeaderboard();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.6 }}
            className="inline-block"
          >
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" className="stroke-gray-100 fill-none" strokeWidth="12" />
                <motion.circle 
                  cx="80" cy="80" r="70" 
                  className={cn(
                    "fill-none",
                    scorePercentage >= 80 ? "stroke-[#58CC02]" : scorePercentage >= 50 ? "stroke-[#FFC800]" : "stroke-red-500"
                  )}
                  strokeWidth="12"
                  strokeDasharray="439.8"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 439.8 }}
                  animate={{ strokeDashoffset: 439.8 - (439.8 * scorePercentage) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-black text-[#4B4B4B]">{scorePercentage}%</span>
              </div>
            </div>
          </motion.div>
          <h1 className="text-4xl font-black text-[#4B4B4B]">
            {scorePercentage >= 80 ? "Outstanding!" : scorePercentage >= 50 ? "Good Job!" : "Keep Practicing!"}
          </h1>
          <p className="text-gray-400 font-black text-lg uppercase tracking-wide">
            You completed {totalQuestions} questions in {formatTime(timeSpent)}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm border-b-4">
            <h3 className="font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#1CB0F6]"/> Skill Breakdown
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 900 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Skills"
                    dataKey="score"
                    stroke="#1CB0F6"
                    strokeWidth={3}
                    fill="#1CB0F6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Analysis & Save */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm border-b-4">
              <h3 className="font-black text-gray-400 uppercase tracking-widest mb-2 border-b-2 border-gray-100 pb-2">Analysis</h3>
              <div className="space-y-4 mt-4">
                <p className="font-bold text-[#4B4B4B] text-lg">
                  <span className="text-gray-400 block text-xs uppercase font-black tracking-wider">Strength</span>
                  {chartData.reduce((prev, current) => (prev.score > current.score) ? prev : current).subject}
                </p>
                <div className="h-px bg-gray-100 my-2" />
                <p className="font-bold text-[#4B4B4B] text-lg">
                  <span className="text-gray-400 block text-xs uppercase font-black tracking-wider">Needs Work</span>
                  <span className="text-red-500 font-black">{weakest.topic}</span> ({weakest.score}%)
                  <span className="block text-sm text-gray-500 mt-1 font-medium">
                    Review {weakest.topic.toLowerCase()} concepts to boost your overall score.
                  </span>
                </p>
              </div>
            </div>

            {!saved ? (
              <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm border-b-4 space-y-4">
                <h3 className="font-black text-gray-400 uppercase tracking-widest">Save to Leaderboard</h3>
                <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
                  <div className="font-black text-purple-800 text-lg">{user.fullName}</div>
                  <div className="font-bold text-sm text-purple-500 uppercase tracking-widest">{user.matricule}</div>
                </div>
                <button
                  onClick={handleSaveScore}
                  className="w-full py-4 bg-[#1CB0F6] text-white rounded-2xl font-black tracking-widest uppercase border-b-4 border-blue-600 hover:brightness-105 active:border-b-0 active:translate-y-[4px] transition-all"
                >
                  SAVE SCORE
                </button>
              </div>
            ) : (
               <div className="bg-[#58CC02]/10 p-6 rounded-3xl border-2 border-[#58CC02]/30 text-[#46A302] font-black text-center uppercase tracking-widest">
                 Score saved!
               </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-6">
          <motion.button
            whileHover={{ backgroundColor: '#f8fafc' }}
            whileTap={{ scale: 0.98, y: 4 }}
            onClick={onHome}
            className="py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 bg-white text-gray-400 border-2 border-gray-200 border-b-4 hover:text-gray-500 tracking-widest uppercase transition-all"
          >
            <RotateCcw className="w-6 h-6" strokeWidth={3} /> HOME
          </motion.button>

          <motion.button
            whileHover={{ brightness: 1.05 }}
            whileTap={{ scale: 0.98, y: 4 }}
            onClick={onLeaderboard}
            className="py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 bg-[#FFC800] text-yellow-900 border-2 border-[#FFC800] border-b-4 border-b-yellow-600 tracking-widest uppercase transition-all"
          >
            <Trophy className="w-6 h-6 shrink-0" strokeWidth={3} /> LEADERBOARD
          </motion.button>
        </div>

      </div>
    </div>
  );
}
