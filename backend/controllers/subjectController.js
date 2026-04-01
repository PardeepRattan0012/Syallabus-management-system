import Subject from '../models/Subject.js';

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public (or Private to users)
export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({});
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Public
export const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (subject) {
            res.json(subject);
        } else {
            res.status(404).json({ message: 'Subject not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Private/Admin
export const createSubject = async (req, res) => {
    try {
        const { name, description, icon, colorHex } = req.body;

        const subjectExists = await Subject.findOne({ name });
        if (subjectExists) {
            return res.status(400).json({ message: 'Subject already exists' });
        }

        const subject = new Subject({
            name,
            description,
            icon: icon || 'Book',
            colorHex: colorHex || 'from-secondary to-purple-600'
        });

        const createdSubject = await subject.save();
        res.status(201).json(createdSubject);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
export const updateSubject = async (req, res) => {
    try {
        const { name, description, icon, colorHex } = req.body;

        const subject = await Subject.findById(req.params.id);

        if (subject) {
            subject.name = name || subject.name;
            subject.description = description || subject.description;
            subject.icon = icon || subject.icon;
            subject.colorHex = colorHex || subject.colorHex;

            const updatedSubject = await subject.save();
            res.json(updatedSubject);
        } else {
            res.status(404).json({ message: 'Subject not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
export const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if (subject) {
            await Subject.deleteOne({ _id: subject._id });
            res.json({ message: 'Subject removed' });
        } else {
            res.status(404).json({ message: 'Subject not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
