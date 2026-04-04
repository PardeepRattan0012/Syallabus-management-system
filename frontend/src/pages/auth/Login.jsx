import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';
import api from '../../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const setUser = useAuthStore(state => state.setUser);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            toast.success('Login Successful!');
            navigate(data.role === 'admin' ? '/admin' : '/welcome');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-primary relative">
            {/* MOTIVATIONAL ARMY SIDE (Background on mobile, Side on Desktop) */}
            <div className="absolute inset-0 lg:relative lg:flex lg:w-1/2 bg-black items-center justify-center overflow-hidden z-0">
                {/* User's IMA Background Image */}
                <div 
                    className="absolute inset-0 opacity-30 lg:opacity-50"
                    style={{
                        backgroundImage: "url('/ima-bg.jpg')",
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}
                />
                
                {/* Gradient Overlays for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-[#0b120c]/90 to-transparent z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 lg:from-transparent to-primary/95 lg:to-primary z-0"></div>
                
                {/* Motivational Quote Content (Hidden on mobile to save space) */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative z-10 max-w-xl text-center hidden lg:block p-12"
                >
                    <div className="w-20 h-1 bg-secondary mx-auto mb-8"></div>
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-100 uppercase tracking-widest leading-tight drop-shadow-2xl">
                        "Remember... <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c3b091] to-[#8ba482]">
                            You already missed a chance
                        </span>
                        <br/> of getting into NDA."
                    </h2>
                    <div className="w-20 h-1 bg-secondary mx-auto mt-8 mb-6"></div>
                    <p className="text-[#8ba482] text-xl uppercase tracking-widest font-bold font-mono">
                        This is your final strike. CDS awaits.
                    </p>
                </motion.div>
            </div>

            {/* LOGIN FORM SIDE */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md p-8 sm:p-10 glass-card !border-t-4 !border-t-secondary relative shadow-2xl bg-[#0b120c]/60 lg:bg-[#0b120c]/40 backdrop-blur-md"
                >
                    {/* Camo subtle overly just for the form box */}
                    <div className="absolute inset-0 camo-overlay opacity-5 pointer-events-none rounded-xl"></div>
                    
                    <div className="text-center mb-8 relative z-10">
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 uppercase tracking-wider">
                            Commence <span className="text-secondary">Login</span>
                        </h1>
                        <p className="text-[#9cb195] mt-2 font-medium tracking-wide text-sm sm:text-base">Enter your credentials to access mission brief.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Operative Email</label>
                            <input 
                                type="email" 
                                className="input-field bg-slate-900/80 !border-[#43583c] focus:!border-[#c3b091]"
                                placeholder="commander@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Access Code</label>
                            <input 
                                type="password" 
                                className="input-field bg-slate-900/80 !border-[#43583c] focus:!border-[#c3b091]"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-primary disabled:opacity-50 mt-4 h-12 sm:h-14 text-base sm:text-lg font-bold tracking-widest uppercase hover:shadow-[0_0_25px_rgba(107,134,58,0.7)]"
                        >
                            {loading ? 'Authenticating...' : 'Enter Dashboard'}
                        </button>
                        
                        <div className="text-center text-sm font-semibold mt-4 text-[#8ba482]">
                            First time reporting? <Link to="/register" className="text-[#c3b091] hover:text-white transition-colors underline underline-offset-4">Register here</Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
