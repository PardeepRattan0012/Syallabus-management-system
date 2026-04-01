import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Shield, LogOut } from 'lucide-react';
import api from '../../api';
import { useAuthStore } from '../../store/authStore';

const Dashboard = () => {
    const [subjectsData, setSubjectsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch new progress tracked endpoint instead of plain subjects
                const { data } = await api.get('/users/dashboard/progress');
                setSubjectsData(data);
            } catch (error) {
                console.error("Failed to fetch dashboard progress", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-6"
            >
                <div className="text-center md:text-left">
                    <h1 className="text-5xl font-black uppercase tracking-wider bg-gradient-to-r from-[#8ba482] via-[#c3b091] to-[#58714f] bg-clip-text text-transparent drop-shadow-lg flex items-center gap-3 justify-center md:justify-start">
                        Mission CDS - {user?.name ? user.name.split(' ')[0] : ''} <Shield className="text-[#c3b091] w-10 h-10" />
                    </h1>
                    <p className="text-[#9cb195] mt-3 text-lg font-medium tracking-wide uppercase">Your mission briefings and progress.</p>
                </div>

                <button
                    onClick={() => {
                        useAuthStore.getState().logout();
                        navigate('/login');
                    }}
                    className="flex shrink-0 items-center gap-2 px-6 py-3 bg-red-900/20 text-red-500 hover:bg-red-900/40 hover:text-red-400 border border-red-900/50 rounded-lg transition-all font-bold tracking-widest uppercase text-sm shadow-[0_0_15px_rgba(153,27,27,0.2)] hover:shadow-[0_0_20px_rgba(153,27,27,0.4)]"
                >
                    <LogOut size={18} /> Disconnect
                </button>
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
                </div>
            ) : subjectsData.length === 0 ? (
                <div className="text-center py-20 glass-card">
                    <BookOpen size={48} className="mx-auto text-slate-500 mb-4" />
                    <h3 className="text-xl text-slate-300 font-medium">No Subjects Available</h3>
                    <p className="text-slate-500 mt-2">Subjects will appear here once added by an admin.</p>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {subjectsData.map((subject) => (
                        <motion.div
                            key={subject._id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/dashboard/subject/${subject._id}`)}
                            className="glass-card p-6 cursor-pointer flex flex-col group relative overflow-hidden h-[300px] shadow-2xl hover:shadow-[0_0_25px_rgba(107,134,58,0.6)] hover:border-[#6b863a]/50 transition-all duration-300"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${subject.colorHex || 'from-secondary to-[#4b5e28]'}`}></div>

                            <div className="flex-1">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${subject.colorHex || 'from-secondary to-[#4b5e28]'} bg-opacity-10 shadow-lg`}>
                                    <BookOpen className="text-white" size={28} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-100 group-hover:text-[#c3b091] transition-colors line-clamp-1">{subject.name}</h2>
                                <p className="text-slate-400 mt-3 line-clamp-2 text-sm leading-relaxed">{subject.description}</p>
                            </div>

                            {/* PROGRESS BAR SECTION */}
                            <div className="mt-4 pb-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</span>
                                    <span className="text-xs font-bold text-secondary">{subject.percentage}%</span>
                                </div>
                                <div className="w-full bg-slate-800/80 rounded-full h-2.5 mb-2 shadow-inner border border-slate-700/50">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${subject.percentage}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className={`h-2.5 rounded-full bg-gradient-to-r ${subject.colorHex || 'from-secondary to-[#4b5e28]'}`}
                                    ></motion.div>
                                </div>
                                <div className="text-xs font-medium text-slate-500 text-right">
                                    {subject.completedTopics} / {subject.totalTopics} Topics Completed
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;
