import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import api from '../../api';

const AdminDashboard = () => {
    const user = useAuthStore(state => state.user);
    const [stats, setStats] = useState({ subjects: 0, topics: 0, users: 0, content: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Subjects', value: stats.subjects },
        { label: 'Total Topics', value: stats.topics },
        { label: 'Total Users', value: stats.users },
        { label: 'Content Uploads', value: stats.content },
    ];

    return (
        <div className="p-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>
                <p className="text-slate-400 mt-2">Welcome back, {user?.name}. Manage your content here.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 flex flex-col items-center justify-center text-center"
                    >
                        <h3 className="text-slate-400 text-sm uppercase tracking-wider">{stat.label}</h3>
                        <p className="text-4xl font-bold text-slate-200 mt-2">
                            {loading ? '...' : stat.value}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
