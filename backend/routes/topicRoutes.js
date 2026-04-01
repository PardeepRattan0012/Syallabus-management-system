import express from 'express';
import {
    getTopicsBySubject,
    createTopic,
    updateTopic,
    deleteTopic
} from '../controllers/topicController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, admin, createTopic);

router.route('/subject/:subjectId')
    .get(getTopicsBySubject);

router.route('/:id')
    .put(protect, admin, updateTopic)
    .delete(protect, admin, deleteTopic);

export default router;
