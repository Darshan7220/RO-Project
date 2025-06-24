import express from 'express';
import { create, getAllCompanies } from '../Controllers/company.js';

const router = express.Router();

router.post('/companies', create);
router.get('/create', getAllCompanies);

export default router;
