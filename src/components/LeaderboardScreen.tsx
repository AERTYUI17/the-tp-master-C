import React from 'react';
import { motion } from 'motion/react';
import { Trophy, ArrowLeft, Clock, Medal } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { cn } from '../lib/utils';

interface LeaderboardScreenProps {
  onBack: () => void;
}

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [entries, setEntries] = React.useState<LeaderboardEntry[]>([]);

  React.useEffect(() => {
    const data = localStorage.getItem('c_master_leaderboard');
    if (data) {
      setEntries(JSON.parse(data));
    } else {
      // Mock data if empty
      setEntries([
        { id: '1', name: 'Dennis Ritchie', matricule: '197200001', score: 100, timeSpent: 120, date: new Date().toISOString() },
        { id: '2', name: 'Ken Thompson', matricule: '197200002', score: 95, timeSpent: 145, date: new Date().toISOString() },
        { id: '3', name: 'Brian Kernighan', matricule: '197200003', score: 90, timeSpent: 180, date: new Date().toISOString() },
      ]);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="p-3 bg-white rounded-2xl border-2 border-gray-200 border-b-4 text-gray-400 hover:text-gray-600 hover:bg-gray-50 active:translate-y-[4px] active:border-b-0 transition-all"
          >
            <ArrowLeft className="w-8 h-8" strokeWidth={3} />
          </button>
          <div className="flex items-center gap-3">
             <Trophy className="w-8 h-8 text-[#FFC800]" strokeWidth={3} />
             <h1 className="text-3xl font-black text-[#4B4B4B]">Leaderboard</h1>
          </div>
        </div>

        <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-sm border-b-4 p-6">
          <h3 className="font-black text-sm uppercase tracking-wider text-gray-400 mb-4">Top Scores</h3>
          
          <div className="space-y-3">
            {entries.length === 0 ? (
               <div className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest">
                 No entries yet. Be the first!
               </div>
            ) : (
              entries.map((entry, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;
                
                return (
                 <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={entry.id} 
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all",
                      isFirst ? "bg-amber-50 border-amber-200" : 
                      isSecond ? "bg-slate-50 border-slate-200" :
                      isThird ? "bg-orange-50 border-orange-200" :
                      "bg-white border-transparent hover:border-gray-100"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shrink-0 shadow-sm",
                      isFirst ? "bg-[#FFC800] border-b-4 border-yellow-500" : 
                      isSecond ? "bg-gray-300 border-b-4 border-gray-400" :
                      isThird ? "bg-orange-400 border-b-4 border-orange-500" :
                      "bg-gray-100 text-gray-400 border-b-4 border-gray-200"
                    )}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 font-bold text-[#4B4B4B] text-xl truncate">
                      {entry.name}
                      <span className="block text-xs text-gray-400 font-bold uppercase tracking-widest">{entry.matricule}</span>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn(
                        "font-black text-xl",
                        entry.score >= 80 ? "text-[#58CC02]" :
                        entry.score >= 50 ? "text-[#FFC800]" : "text-red-500"
                      )}>
                        {entry.score}%
                      </span>
                      <div className="flex items-center gap-1 text-gray-400 font-black text-xs uppercase tracking-widest">
                        <Clock className="w-3 h-3" strokeWidth={3} />
                        {formatTime(entry.timeSpent)}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
