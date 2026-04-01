import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Layers, CheckCircle } from 'lucide-react';
import api from '../../api';
import { useAuthStore } from '../../store/authStore';

const TopicExplorer = () => {
    const { subjectId } = useParams();
    const [subject, setSubject] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // Auth Store for Progress
    const user = useAuthStore(state => state.user);
    const updateProgress = useAuthStore(state => state.updateProgress);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subRes, topicsRes] = await Promise.all([
                    api.get(`/subjects/${subjectId}`),
                    api.get(`/topics/subject/${subjectId}`)
                ]);
                setSubject(subRes.data);
                setTopics(topicsRes.data);
            } catch (error) {
                console.error("Failed to fetch topics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [subjectId]);

    const toggleProgress = async (e, topicId) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigating to topic
        try {
            const { data } = await api.post(`/users/progress/${topicId}`);
            updateProgress(data);
        } catch (error) {
            console.error("Failed to update progress", error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0 }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-primary">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen">
            <Link to="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 transition-colors">
                <ArrowLeft size={20} /> Back to Dashboard
            </Link>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12 glass-card p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden"
            >
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${subject?.colorHex || 'from-secondary to-[#4b5e28]'} opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2`}></div>
                
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br ${subject?.colorHex || 'from-secondary to-[#4b5e28]'} bg-opacity-20 shadow-lg shrink-0`}>
                    <Layers className="text-white" size={40} />
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100">{subject?.name}</h1>
                    <p className="text-slate-400 mt-3 text-lg">{subject?.description}</p>
                </div>
            </motion.div>

            <h2 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3">
                 Course Topics <span className="bg-slate-800 text-sm py-1 px-3 rounded-full text-secondary">{topics.length}</span>
            </h2>

            {topics.length === 0 ? (
                <div className="text-center py-20 glass-card">
                    <h3 className="text-xl text-slate-300 font-medium">No Topics Available</h3>
                    <p className="text-slate-500 mt-2">Content for this subject hasn't been added yet.</p>
                </div>
            ) : (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {topics.map((topic, index) => {
                        const isCompleted = user?.progress?.includes(topic._id);
                        
                        return (
                        <motion.div
                            key={topic._id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.01, x: 5 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => navigate(`/dashboard/topic/${topic._id}`)}
                            className={`glass-card p-6 cursor-pointer flex items-center justify-between group hover:shadow-[0_0_20px_rgba(107,134,58,0.5)] hover:border-[#6b863a]/80 transition-all duration-300 shadow-xl border-l-4 ${isCompleted ? 'border-l-emerald-500' : 'border-l-transparent'}`}
                        >
                            <div className="flex items-center gap-6 flex-1">
                                <div className="text-4xl font-black text-[#58714f] group-hover:text-[#c3b091] transition-colors">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors flex items-center gap-3">
                                        {topic.name}
                                    </h3>
                                    <p className="text-slate-500 mt-1 line-clamp-1 max-w-md">{topic.description}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <button
                                    onClick={(e) => toggleProgress(e, topic._id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all shadow-md ${
                                        isCompleted 
                                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20' 
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                                    }`}
                                >
                                    <CheckCircle size={18} className={isCompleted ? 'fill-emerald-500/20' : ''} />
                                    {isCompleted ? 'Completed' : 'Mark as Done'}
                                </button>
                                
                                <div className="w-12 h-12 rounded-full bg-[#1a2015] flex items-center justify-center group-hover:bg-[#6b863a] transition-colors shadow-lg hidden sm:flex">
                                    <ChevronRight className="text-slate-400 group-hover:text-white transition-colors" size={24} />
                                </div>
                            </div>
                        </motion.div>
                    )})}
                </motion.div>
            )}
        </div>
    );
};

export default TopicExplorer;
