import React from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center bg-[#0f0c29] font-sans">
      
      {/* Custom Animation Styles */}
      <style>
        {`
          @keyframes nebulaMove {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-5%, -5%); }
            100% { transform: translate(0, 0); }
          }
          .animate-nebula {
            animation: nebulaMove 20s ease infinite;
          }
        `}
      </style>

      {/* Moving Nebula Background */}
      <div className="absolute top-0 left-0 w-[200%] h-[200%] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] z-0 animate-nebula"></div>
      
      {/* Stars Overlay */}
      <div className="absolute top-0 left-0 w-full h-full z-[2] opacity-10 bg-[radial-gradient(white_1px,transparent_1px)] bg-[length:50px_50px]"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Headings */}
        <h1 className="text-6xl font-extrabold text-white tracking-widest mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          CareerVector
        </h1>
        <p className="text-xl text-[#a3a3a3] mb-12 tracking-widest uppercase">
          Select your gateway.
        </p>

        {/* Card Container */}
        <div className="flex gap-8 flex-wrap justify-center">
          
          {/* STUDENT CARD */}
          <div 
            onClick={() => navigate('/student/login')}
            className="group relative w-[260px] h-[340px] flex flex-col items-center justify-center p-10 cursor-pointer rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 hover:scale-105 hover:bg-white/10 overflow-hidden"
          >
            {/* Blue Orb */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500 rounded-full blur-[60px] opacity-60"></div>
            
            <h2 className="text-4xl font-bold text-white mb-2 z-10">Student</h2>
            <p className="text-base text-slate-300 z-10">Launch your career.</p>
            <div className="mt-8 text-4xl text-white/70 transition-transform duration-300 group-hover:translate-x-2">
              &rarr;
            </div>
          </div>

          {/* RECRUITER CARD */}
          <div 
            onClick={() => navigate('/recruiter/login')}
            className="group relative w-[260px] h-[340px] flex flex-col items-center justify-center p-10 cursor-pointer rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 hover:scale-105 hover:bg-white/10 overflow-hidden"
          >
            {/* Purple Orb */}
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-purple-500 rounded-full blur-[60px] opacity-60"></div>
            
            <h2 className="text-4xl font-bold text-white mb-2 z-10">Recruiter</h2>
            <p className="text-base text-slate-300 z-10">Hire top talent.</p>
            <div className="mt-8 text-4xl text-white/70 transition-transform duration-300 group-hover:translate-x-2">
              &rarr;
            </div>
          </div>

          {/* ADMIN CARD */}
          <div 
            onClick={() => navigate('/admin/login')}
            className="group relative w-[260px] h-[340px] flex flex-col items-center justify-center p-10 cursor-pointer rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 hover:scale-105 hover:bg-white/10 overflow-hidden"
          >
            {/* Green Orb */}
            <div className="absolute -top-12 -left-12 w-36 h-36 bg-emerald-500 rounded-full blur-[60px] opacity-60"></div>
            
            <h2 className="text-4xl font-bold text-white mb-2 z-10">Admin</h2>
            <p className="text-base text-slate-300 z-10">Manage platform.</p>
            <div className="mt-8 text-4xl text-white/70 transition-transform duration-300 group-hover:translate-x-2">
              &rarr;
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;