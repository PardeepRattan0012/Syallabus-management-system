import Topic from '../models/Topic.js';

// @desc    Get all topics for a subject
// @route   GET /api/topics/subject/:subjectId
// @access  Public
export const getTopicsBySubject = async (req, res) => {
    try {
        const topics = await Topic.find({ subjectId: req.params.subjectId }).sort({ order: 1 });
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a topic
// @route   POST /api/topics
// @access  Private/Admin
export const createTopic = async (req, res) => {
    try {
        const { subjectId, name, description, order } = req.body;

        const topic = new Topic({
            subjectId,
            name,
            description,
            order: order || 0
        });

        const createdTopic = await topic.save();
        res.status(201).json(createdTopic);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a topic
// @route   PUT /api/topics/:id
// @access  Private/Admin
export const updateTopic = async (req, res) => {
    try {
        const { name, description, order } = req.body;

        const topic = await Topic.findById(req.params.id);

        if (topic) {
            topic.name = name || topic.name;
            topic.description = description || topic.description;
            topic.order = order !== undefined ? order : topic.order;

            const updatedTopic = await topic.save();
            res.json(updatedTopic);
        } else {
            res.status(404).json({ message: 'Topic not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a topic
// @route   DELETE /api/topics/:id
// @access  Private/Admin
export const deleteTopic = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);

        if (topic) {
            await Topic.deleteOne({ _id: topic._id });
            res.json({ message: 'Topic removed' });
        } else {
            res.status(404).json({ message: 'Topic not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
