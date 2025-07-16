import express from 'express';

import userRoutes from './userRoutes';

import motionEventRoutes from './motionEventRoutes';
import smsRoutes from './smsRoutes';



const router = express.Router();

router.use('/users', userRoutes);

router.use('/motion', motionEventRoutes);
router.use('/notification', smsRoutes);



export default router;
