import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';
import User from '../models/User.js';
import Content from '../models/Content.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalSubjects = await Subject.countDocuments();
        const totalTopics = await Topic.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalContent = await Content.countDocuments(); // Count of content documents, though it could be total videos + notes if wanted

        res.json({
            subjects: totalSubjects,
            topics: totalTopics,
            users: totalUsers,
            content: totalContent
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
