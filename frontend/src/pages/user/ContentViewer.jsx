import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, FileText, Video as VideoIcon } from 'lucide-react';
import api from '../../api';

const ContentViewer = () => {
    const { topicId } = useParams();
    const [topic, setTopic] = useState(null);
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('videos');

    // Helper to get YouTube Embed URL
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else if (url.includes('/live/')) {
            videoId = url.split('/live/')[1].split('?')[0];
        } else if (url.includes('/shorts/')) {
            videoId = url.split('/shorts/')[1].split('?')[0];
        } else if (url.includes('embed/')) {
            return url; // Already an embed URL
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                // Fetch basic topic details (optional - we could just fetch content, but topic name is nice)
                // We'd need an API to fetch a single topic, but assuming we have it:
                // For now, let's just fetch content directly.
                const { data } = await api.get(`/content/topic/${topicId}`);
                setContent(data);
            } catch (error) {
                console.error("Failed to fetch content", error);
                setContent(null); // Explicitly handle 404
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [topicId]);

    if (loading) return (
        <div className="flex justify-center flex-col items-center h-screen bg-primary">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6b863a] mb-4"></div>
            <p className="text-slate-400">Loading Content...</p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen">
            <button onClick={() => window.history.back()} className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 transition-colors">
                <ArrowLeft size={20} /> Back to Topics
            </button>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-black bg-gradient-to-r from-[#8ba482] via-[#c3b091] to-[#58714f] bg-clip-text text-transparent mb-6 uppercase tracking-wider drop-shadow-md">
                    Learning Material
                </h1>

                {/* Tabs */}
                <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-xl w-full max-w-sm mb-8">
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-medium rounded-lg transition-all ${
                            activeTab === 'videos' 
                                ? 'bg-[#1a2015] text-[#c3b091] border border-[#6b863a]/50 shadow-[0_0_15px_rgba(107,134,58,0.3)]' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                    >
                        <VideoIcon size={18} /> Videos
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-medium rounded-lg transition-all ${
                            activeTab === 'notes' 
                                ? 'bg-[#1a2015] text-[#c3b091] border border-[#6b863a]/50 shadow-[0_0_15px_rgba(107,134,58,0.3)]' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                    >
                        <FileText size={18} /> Notes (PDF)
                    </button>
                </div>
                
                {/* Content Area */}
                <div className="glass-card p-4 md:p-8 min-h-[60vh]">
                    <AnimatePresence mode="wait">
                        {!content ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-20"
                            >
                                <PlayCircle size={48} className="mx-auto text-slate-500 mb-4" />
                                <h3 className="text-xl text-slate-300 font-medium">No Content Uploaded</h3>
                                <p className="text-slate-500 mt-2">The instructor hasn't added materials for this topic yet.</p>
                            </motion.div>
                        ) : activeTab === 'videos' ? (
                            <motion.div 
                                key="videos"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {content.videos?.length > 0 ? content.videos.map((vid, idx) => (
                                    <div key={idx} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
                                        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                                            <h3 className="text-lg font-bold text-slate-200">{vid.title}</h3>
                                        </div>
                                        <div className="aspect-video w-full bg-black relative">
                                            <iframe 
                                                src={getYouTubeEmbedUrl(vid.url)}
                                                title={vid.title}
                                                className="absolute top-0 left-0 w-full h-full border-none"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 text-slate-400">No videos uploaded for this topic.</div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="notes"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                {content.notes?.length > 0 ? content.notes.map((note, idx) => (
                                    <div key={idx} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 flex flex-col items-center">
                                        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700 w-full mb-4">
                                            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-3">
                                                <FileText className="text-red-400"/> {note.title}
                                            </h3>
                                            <a 
                                                href={note.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm bg-[#6b863a]/20 text-[#c3b091] hover:bg-[#6b863a]/40 px-4 py-2 rounded-lg transition-all font-medium border border-[#6b863a]/50 hover:shadow-[0_0_15px_rgba(107,134,58,0.5)]"
                                            >
                                                Download PDF
                                            </a>
                                        </div>
                                        
                                        {/* Google Docs Viewer for universal PDF rendering */}
                                        <iframe 
                                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(note.url)}&embedded=true`} 
                                            title={note.title}
                                            className="w-full h-[70vh] rounded-b-xl border-none"
                                        />
                                    </div>
                                )) : (
                                    <div className="text-center py-10 text-slate-400">No notes uploaded for this topic.</div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ContentViewer;
