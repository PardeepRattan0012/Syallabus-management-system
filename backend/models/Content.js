import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true,
        unique: true // Usually one content document per topic that holds arrays of videos/notes
    },
    videos: [{
        title: String,
        url: String, // YouTube embedded URL
        duration: String
    }],
    notes: [{
        title: String,
        url: String, // Cloudinary PDF URL
        filename: String
    }]
}, {
    timestamps: true
});

const Content = mongoose.model('Content', contentSchema);
export default Content;
