import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User } from '../types';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [fullName, setFullName] = useState('');
  const [matricule, setMatricule] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && matricule.trim()) {
      onLogin({ fullName: fullName.trim(), matricule: matricule.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 font-sans text-[#4B4B4B]">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full bg-white p-8 rounded-3xl border-2 border-gray-200 border-b-4 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-purple-600"></div>
        <div className="text-center mb-8 mt-4">
          <div className="w-20 h-20 bg-purple-500 rounded-2xl mx-auto flex items-center justify-center border-b-4 border-purple-600 mb-4 shadow-sm">
            <span className="text-white text-4xl font-black font-mono">C</span>
          </div>
          <h2 className="text-3xl font-black mb-2 text-[#4B4B4B]">Student Portal</h2>
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Verify your identity to start</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="font-black text-sm uppercase tracking-widest text-gray-400">Full Name</label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all font-bold text-[#4B4B4B] placeholder:text-gray-300"
              placeholder="E.g. John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="font-black text-sm uppercase tracking-widest text-gray-400">Matricule</label>
            <input 
              type="text" 
              required
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all font-bold text-[#4B4B4B] placeholder:text-gray-300"
              placeholder="E.g. 202410123"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!fullName.trim() || !matricule.trim()}
              className="w-full py-4 bg-purple-500 text-white rounded-2xl font-black tracking-widest uppercase border-b-4 border-purple-600 hover:brightness-105 active:border-b-0 active:translate-y-[4px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Sign In and Begin
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
