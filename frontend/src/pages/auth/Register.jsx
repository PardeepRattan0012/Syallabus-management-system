import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';
import api from '../../api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const setUser = useAuthStore(state => state.setUser);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            setUser(data);
            toast.success('Registration Successful!');
            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/welcome');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary">
            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 glass-card"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                        Create Account
                    </h1>
                    <p className="text-slate-400 mt-2">Join us and start preparing</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            className="input-field"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            className="input-field"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            minLength="6"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    
                    <div className="text-center text-sm text-slate-400">
                        Already have an account? <Link to="/login" className="text-accent hover:underline">Sign In</Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
