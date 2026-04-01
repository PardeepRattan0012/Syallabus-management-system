import express from 'express';
import {
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject
} from '../controllers/subjectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getSubjects)
    .post(protect, admin, createSubject);

router.route('/:id')
    .get(getSubjectById)
    .put(protect, admin, updateSubject)
    .delete(protect, admin, deleteSubject);

export default router;
