import express from 'express';
import { uploadProductPhotos } from '../Middleware/upload.js';
import { createProduct } from '../Controllers/product.js';

const router = express.Router();

router.post('/create', uploadProductPhotos, createProduct);

export default router;
