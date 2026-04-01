import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';

const ManageContent = () => {
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    
    const [selectedTopic, setSelectedTopic] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [noteFile, setNoteFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            const { data } = await api.get('/subjects');
            setSubjects(data);
        };
        fetchSubjects();
    }, []);

    const handleSubjectChange = async (e) => {
        const subId = e.target.value;
        setSelectedTopic('');
        if (subId) {
            const { data } = await api.get(`/topics/subject/${subId}`);
            setTopics(data);
        } else {
            setTopics([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTopic) {
            return toast.error('Please select a topic first.');
        }

        const formData = new FormData();
        formData.append('topicId', selectedTopic);
        if (videoTitle) formData.append('videoTitle', videoTitle);
        if (videoUrl) formData.append('videoUrl', videoUrl);
        if (noteFile) formData.append('noteFile', noteFile);

        setLoading(true);
        try {
            await api.post('/content', formData);
            toast.success('Content uploaded successfully!');
            // Reset form
            setVideoTitle('');
            setVideoUrl('');
            setNoteFile(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-6">
                Manage Content
            </h1>
            
            <div className="glass-card p-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Select Subject</label>
                            <select onChange={handleSubjectChange} className="input-field bg-slate-900/80">
                                <option value="">-- Choose Subject --</option>
                                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Select Topic</label>
                            <select 
                                value={selectedTopic} 
                                onChange={(e) => setSelectedTopic(e.target.value)} 
                                className="input-field bg-slate-900/80"
                                disabled={topics.length === 0}
                            >
                                <option value="">-- Choose Topic --</option>
                                {topics.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-slate-700 pt-6">
                        <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                            <span className="text-red-500">▶</span> Add YouTube Video
                        </h3>
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Video Title" 
                                className="input-field" 
                                value={videoTitle}
                                onChange={e => setVideoTitle(e.target.value)}
                            />
                            <input 
                                type="url" 
                                placeholder="YouTube URL" 
                                className="input-field" 
                                value={videoUrl}
                                onChange={e => setVideoUrl(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-700 pt-6">
                        <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                            <span className="text-red-500">📄</span> Upload PDF Notes
                        </h3>
                        <input 
                            type="file" 
                            accept="application/pdf"
                            className="input-field py-2"
                            onChange={e => setNoteFile(e.target.files[0])}
                        />
                        <p className="text-xs text-slate-400 mt-2">File will be securely uploaded to Cloudinary.</p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || (!videoUrl && !noteFile)}
                        className="w-full btn-primary disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Uploading & Processing...' : 'Save Content'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManageContent;
