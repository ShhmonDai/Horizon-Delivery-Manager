import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deleteapartment, getapartments, updateapartment } from '../controllers/apartment.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getapartments', getapartments)
router.delete('/deleteapartment/:apartmentNumber', verifyToken, deleteapartment)
router.put('/updateapartment/:apartmentNumber', verifyToken, updateapartment)



export default router;