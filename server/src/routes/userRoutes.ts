import express from 'express';
import { loginUser, registerUser, validateToken, getFarmers, checkPhoneVerification } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/validate', authenticateToken, validateToken);
router.get('/farmers', authenticateToken, getFarmers);
router.get('/phone-verification-status', authenticateToken, checkPhoneVerification);


export default router;
