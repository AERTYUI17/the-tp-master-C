import React from 'react';
import { motion } from 'motion/react';
import { Play, Trophy, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

interface StartScreenProps {
  onStart: () => void;
  onLeaderboard: () => void;
}

export function StartScreen({ onStart, onLeaderboard }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 space-y-8 max-w-md mx-auto text-[#4B4B4B]">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="w-32 h-32 bg-purple-500 rounded-3xl rounded-tr-md flex items-center justify-center border-b-8 border-r-4 border-purple-700 mb-8 shadow-sm"
      >
        <span className="text-white text-6xl font-black font-mono">C</span>
      </motion.div>

      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black tracking-tight">
          C Master Test
        </h1>
        <p className="text-gray-500 font-bold text-lg">
          Master Pointers, Structs, and Files. Prove your skills!
        </p>
      </div>

      <div className="w-full space-y-4 pt-8">
        <motion.button
          whileHover={{ brightness: 1.05 }}
          whileTap={{ scale: 0.98, y: 4 }}
          onClick={onStart}
          className={cn(
            "w-full py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-2 tracking-widest uppercase transition-all shadow-sm",
            "bg-purple-500 text-white border-2 border-purple-500 border-b-4 border-b-purple-700"
          )}
        >
          <Play className="fill-current w-6 h-6" />
          START TEST
        </motion.button>

        <motion.button
          whileHover={{ backgroundColor: '#f8fafc' }} // Tailwind slate-50
          whileTap={{ scale: 0.98, y: 4 }}
          onClick={onLeaderboard}
          className={cn(
            "w-full py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-2 tracking-widest uppercase transition-all shadow-sm",
            "bg-white text-gray-400 border-2 border-gray-200 border-b-4 hover:bg-gray-50 hover:text-gray-500"
          )}
        >
          <Trophy className="text-[#FFC800] w-6 h-6" />
          LEADERBOARD
        </motion.button>
      </div>
    </div>
  );
}
