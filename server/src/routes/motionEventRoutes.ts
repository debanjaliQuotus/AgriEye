import express from 'express';
import multer from 'multer';
import { createMotionEvent, getAllMotionEvents } from '../controllers/motionEventController';

const router = express.Router();

// Set up multer to read image as Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post('/', upload.single('photo'), createMotionEvent);
router.get('/', getAllMotionEvents);

export default router;
