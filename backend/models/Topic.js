import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a topic name']
    },
    description: {
        type: String
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;
