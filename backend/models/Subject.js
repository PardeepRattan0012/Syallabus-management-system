import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a subject name'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    icon: {
        type: String,
        default: 'Book' // Default lucide-react icon name
    },
    colorHex: {
        type: String,
        default: 'from-secondary to-purple-600' // Default tailwind gradient classes
    }
}, {
    timestamps: true
});

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
