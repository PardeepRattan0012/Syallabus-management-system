import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Edit2, Trash2, Plus, Filter } from 'lucide-react';
import api from '../../api';

const ManageTopics = () => {
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', subjectId: '', order: 0
    });

    const fetchSubjects = async () => {
        try {
            const { data } = await api.get('/subjects');
            setSubjects(data);
        } catch (error) {
            toast.error('Failed to fetch subjects');
        }
    };

    const fetchTopics = async (subjectId) => {
        if (!subjectId) {
            setTopics([]);
            return;
        }
        try {
            const { data } = await api.get(`/topics/subject/${subjectId}`);
            setTopics(data);
        } catch (error) {
            toast.error('Failed to fetch topics');
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        fetchTopics(selectedSubjectFilter);
    }, [selectedSubjectFilter]);

    const handleOpenModal = (topic = null) => {
        if (topic) {
            setEditMode(true);
            setCurrentId(topic._id);
            setFormData({
                name: topic.name,
                description: topic.description,
                subjectId: topic.subjectId,
                order: topic.order
            });
        } else {
            setEditMode(false);
            setCurrentId(null);
            setFormData({ name: '', description: '', subjectId: selectedSubjectFilter || '', order: 0 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editMode) {
                await api.put(`/topics/${currentId}`, formData);
                toast.success('Topic updated');
            } else {
                await api.post('/topics', formData);
                toast.success('Topic created');
            }
            if (selectedSubjectFilter === formData.subjectId) {
                fetchTopics(selectedSubjectFilter);
            } else {
                setSelectedSubjectFilter(formData.subjectId);
            }
            handleCloseModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this topic?')) {
            try {
                await api.delete(`/topics/${id}`);
                toast.success('Topic deleted');
                fetchTopics(selectedSubjectFilter);
            } catch (error) {
                toast.error('Failed to delete topic');
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                    Manage Topics
                </h1>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700 rounded-lg px-3 w-full sm:w-auto">
                        <Filter size={18} className="text-slate-400" />
                        <select 
                            className="bg-transparent text-slate-200 py-3 outline-none w-full appearance-none"
                            value={selectedSubjectFilter}
                            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                        >
                            <option value="" className="bg-slate-900">Filter by Subject</option>
                            {subjects.map(s => (
                                <option key={s._id} value={s._id} className="bg-slate-900">{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center whitespace-nowrap">
                        <Plus size={18} /> Add Topic
                    </button>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/80 border-b border-slate-700">
                            <th className="p-4 text-slate-300 font-medium tracking-wide w-1/4">Name</th>
                            <th className="p-4 text-slate-300 font-medium tracking-wide w-2/4">Description</th>
                            <th className="p-4 text-slate-300 font-medium tracking-wide w-1/4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!selectedSubjectFilter ? (
                            <tr>
                                <td colSpan="3" className="p-8 text-center text-slate-400">Please select a subject to view its topics.</td>
                            </tr>
                        ) : topics.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="p-8 text-center text-slate-500">No topics found for this subject.</td>
                            </tr>
                        ) : topics.map(topic => (
                            <tr key={topic._id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 font-medium text-slate-200">{topic.name}</td>
                                <td className="p-4 text-slate-400 truncate max-w-sm">{topic.description}</td>
                                <td className="p-4 flex gap-3">
                                    <button onClick={() => handleOpenModal(topic)} className="text-secondary hover:text-indigo-300 p-2 rounded-md hover:bg-slate-800 transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(topic._id)} className="text-red-400 hover:text-red-300 p-2 rounded-md hover:bg-slate-800 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="glass-card p-6 w-full max-w-lg bg-slate-900 border-slate-700 shadow-2xl">
                        <h2 className="text-xl font-bold text-slate-100 mb-4">{editMode ? 'Edit Topic' : 'Add Topic'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Subject</label>
                                <select 
                                    className="input-field" 
                                    value={formData.subjectId}
                                    onChange={e => setFormData({...formData, subjectId: e.target.value})}
                                    required
                                >
                                    <option value="">-- Select Subject --</option>
                                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Topic Name</label>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Description</label>
                                <textarea 
                                    className="input-field min-h-[80px]" 
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    required 
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Display Order (Optional)</label>
                                <input 
                                    type="number" 
                                    className="input-field" 
                                    value={formData.order}
                                    onChange={e => setFormData({...formData, order: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={loading} className="btn-primary flex-1">
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button type="button" onClick={handleCloseModal} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTopics;
