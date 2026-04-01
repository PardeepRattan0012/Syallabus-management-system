import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';
import api from '../../api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                toast.success('User deleted');
                fetchUsers();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                    Manage Users
                </h1>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/80 border-b border-slate-700">
                            <th className="p-4 text-slate-300 font-medium tracking-wide">Name</th>
                            <th className="p-4 text-slate-300 font-medium tracking-wide">Email</th>
                            <th className="p-4 text-slate-300 font-medium tracking-wide">Role</th>
                            <th className="p-4 text-slate-300 font-medium tracking-wide">Joined</th>
                            <th className="p-4 text-slate-300 font-medium tracking-wide">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-slate-500">Loading users...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-slate-500">No users found</td>
                            </tr>
                        ) : users.map(user => (
                            <tr key={user._id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 font-medium text-slate-200">{user.name}</td>
                                <td className="p-4 text-slate-400">{user.email}</td>
                                <td className="p-4 text-slate-400">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-secondary/20 text-secondary' : 'bg-slate-700 text-slate-300'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-400 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 flex gap-3">
                                    {user.role !== 'admin' && (
                                        <button 
                                            onClick={() => handleDelete(user._id)} 
                                            className="text-red-400 hover:text-red-300 p-2 rounded-md hover:bg-slate-800 transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
