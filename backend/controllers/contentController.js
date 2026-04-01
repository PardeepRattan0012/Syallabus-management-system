import Content from '../models/Content.js';

// @desc    Get content for a topic
// @route   GET /api/content/topic/:topicId
// @access  Public
export const getContentByTopic = async (req, res) => {
    try {
        const content = await Content.findOne({ topicId: req.params.topicId });
        if (content) {
            res.json(content);
        } else {
            res.status(404).json({ message: 'Content not found for this topic' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create or Update Content (Upload PDF / Add YouTube links)
// @route   POST /api/content
// @access  Private/Admin
export const saveContent = async (req, res) => {
    try {
        const { topicId, videoTitle, videoUrl, videoDuration } = req.body;

        let content = await Content.findOne({ topicId });

        if (!content) {
            content = new Content({
                topicId,
                videos: [],
                notes: []
            });
        }

        // Handle Video Addition
        if (videoUrl && videoTitle) {
            content.videos.push({
                title: videoTitle,
                url: videoUrl,
                duration: videoDuration || ''
            });
        }

        // Handle File Upload via Cloudinary
        if (req.file) {
            content.notes.push({
                title: req.file.originalname,
                url: req.file.path,
                filename: req.file.filename
            });
        }

        const savedContent = await content.save();
        res.status(201).json(savedContent);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Remove video from content
// @route   DELETE /api/content/:id/video/:videoId
// @access  Private/Admin
export const deleteVideo = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        if (content) {
            content.videos = content.videos.filter(v => v._id.toString() !== req.params.videoId);
            await content.save();
            res.json(content);
        } else {
            res.status(404).json({ message: 'Content not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Remove note from content
// @route   DELETE /api/content/:id/note/:noteId
// @access  Private/Admin
export const deleteNote = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        if (content) {
            // Note: In an ideal world, we'd also delete from Cloudinary here
            content.notes = content.notes.filter(n => n._id.toString() !== req.params.noteId);
            await content.save();
            res.json(content);
        } else {
            res.status(404).json({ message: 'Content not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
