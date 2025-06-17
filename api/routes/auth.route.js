import express from 'express';
import { google, signin, signup, signindemo, authenticateToken } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.post('/signindemo', signindemo);
router.post('/authenticateToken', verifyToken, authenticateToken);

export default router;