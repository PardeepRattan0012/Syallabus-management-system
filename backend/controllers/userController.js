import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Toggle topic completion progress
// @route   POST /api/users/progress/:topicId
// @access  Private
export const toggleTopicProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const topicId = req.params.topicId;
        const hasCompleted = user.progress.some(id => id.toString() === topicId.toString());

        if (hasCompleted) {
            await User.findByIdAndUpdate(req.user._id, { $pull: { progress: topicId } });
        } else {
            await User.findByIdAndUpdate(req.user._id, { $addToSet: { progress: topicId } });
        }

        const updatedUser = await User.findById(req.user._id);
        res.json(updatedUser.progress);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get dashboard progress data
// @route   GET /api/users/dashboard/progress
// @access  Private
export const getUserDashboardProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const subjects = await Subject.find({});
        const topics = await Topic.find({});

        const dashboardData = subjects.map(sub => {
            const subTopics = topics.filter(t => t.subjectId.toString() === sub._id.toString());
            const totalTopics = subTopics.length;
            const completedTopics = subTopics.filter(t => (user.progress || []).some(id => id.toString() === t._id.toString())).length;
            
            return {
                _id: sub._id,
                name: sub.name,
                description: sub.description,
                icon: sub.icon,
                colorHex: sub.colorHex,
                totalTopics,
                completedTopics,
                percentage: totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100)
            };
        });

        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
