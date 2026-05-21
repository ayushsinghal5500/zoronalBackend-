import express from 'express';
import { createCompany,getSingleCompany,getAllCompanies } from '../controllers/company.controller.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

// Create company route
router.post('/create', upload.single('logo'), createCompany);
router.get('/all', getAllCompanies);
router.get('/:id', getSingleCompany);
export default router;
