import express from 'express';
import {
    getContentByTopic,
    saveContent,
    deleteVideo,
    deleteNote
} from '../controllers/contentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
    .post(protect, admin, upload.single('noteFile'), saveContent);

router.route('/topic/:topicId')
    .get(getContentByTopic);

router.route('/:id/video/:videoId')
    .delete(protect, admin, deleteVideo);

router.route('/:id/note/:noteId')
    .delete(protect, admin, deleteNote);

export default router;
