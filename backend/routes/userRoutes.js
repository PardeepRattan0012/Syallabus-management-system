import express from 'express';
import { getUsers, deleteUser, toggleTopicProgress, getUserDashboardProgress } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getUsers);

router.route('/dashboard/progress')
    .get(protect, getUserDashboardProgress);

router.route('/progress/:topicId')
    .post(protect, toggleTopicProgress);

router.route('/:id')
    .delete(protect, admin, deleteUser);

export default router;
