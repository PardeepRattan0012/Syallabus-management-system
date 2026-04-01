import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Flag, ShieldAlert, Crosshair } from 'lucide-react';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-primary relative flex items-center justify-center overflow-hidden">
            {/* Dark abstract army background overlay */}
            <div className="absolute inset-0 bg-[url('/ima-bg.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-radial from-transparent to-[#050806] z-0"></div>

            {/* Motivational Quotes (4 Corners) */}
            <div className="absolute top-8 left-8 max-w-xs z-10 hidden md:block">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <div className="flex items-center gap-3 mb-2 text-[#6b863a]">
                        <Target size={20} />
                        <span className="font-bold tracking-widest text-sm uppercase">Focus</span>
                    </div>
                    <p className="text-slate-400 italic text-sm border-l-2 border-[#6b863a] pl-3">"Victory belongs to the most persevering."</p>
                </motion.div>
            </div>

            <div className="absolute top-8 right-8 max-w-xs z-10 hidden md:block text-right">
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <div className="flex items-center justify-end gap-3 mb-2 text-[#c3b091]">
                        <span className="font-bold tracking-widest text-sm uppercase">Discipline</span>
                        <Flag size={20} />
                    </div>
                    <p className="text-slate-400 italic text-sm border-r-2 border-[#c3b091] pr-3">"Discipline is the bridge between goals and accomplishment."</p>
                </motion.div>
            </div>

            <div className="absolute bottom-8 left-8 max-w-xs z-10 hidden md:block">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                    <div className="flex items-center gap-3 mb-2 text-red-900/80">
                        <ShieldAlert size={20} />
                        <span className="font-bold tracking-widest text-sm uppercase text-red-500/80">Sacrifice</span>
                    </div>
                    <p className="text-slate-400 italic text-sm border-l-2 border-red-900/50 pl-3">"Sweat in training, bleed less in war."</p>
                </motion.div>
            </div>

            <div className="absolute bottom-8 right-8 max-w-xs z-10 hidden md:block text-right">
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                    <div className="flex items-center justify-end gap-3 mb-2 text-slate-500">
                        <span className="font-bold tracking-widest text-sm uppercase">Courage</span>
                        <Crosshair size={20} />
                    </div>
                    <p className="text-slate-400 italic text-sm border-r-2 border-slate-700 pr-3">"The brave do not live forever, but the cautious do not live at all."</p>
                </motion.div>
            </div>

            {/* Center "Let's Go" Action */}
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative z-20 text-center"
            >
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="group relative px-12 py-6 outline-none block mx-auto"
                >
                    <div className="absolute inset-0 bg-[#6b863a] rounded-xl transform blur-xl opacity-30 group-hover:opacity-70 group-hover:bg-[#c3b091] transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1c2415] to-[#0a0d08] rounded-xl border border-[#43583c] group-hover:border-[#c3b091] transition-all duration-300"></div>
                    
                    <span className="relative z-10 text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#e3e8de] to-[#8ba482] uppercase flex flex-col gap-2 group-hover:from-white group-hover:to-[#c3b091] transition-all duration-300 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                        Let's Go
                        <span className="text-3xl md:text-5xl font-extrabold text-[#c3b091] mt-[-10px] tracking-widest uppercase text-center w-full block">Buddy</span>
                    </span>

                    {/* Radar Pulse Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-[#8ba482]/20 rounded-xl animate-ping" style={{ animationDuration: '3s' }}></div>
                </button>
                <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-8 text-slate-500 font-medium tracking-[0.3em] uppercase text-sm animate-pulse"
                >
                    Click to commence mission
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Welcome;
