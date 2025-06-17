import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deleteapartment, getapartments, updateapartment, markasdelivered, deliverall, getpackagehistory } from '../controllers/apartment.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getapartments', getapartments);
router.get('/getpackagehistory', getpackagehistory);
router.delete('/deleteapartment/:apartmentNumber', verifyToken, deleteapartment);
router.put('/updateapartment/:apartmentNumber', verifyToken, updateapartment);
router.put('/markasdelivered/:apartmentNumber', verifyToken, markasdelivered);
router.put('/deliverall', verifyToken, deliverall);




export default router;