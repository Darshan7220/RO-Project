import express from 'express';
import { createValidator } from 'express-joi-validation';
import VSchema from '../Middleware/validation.js';
import { register } from '../Controllers/user.js';
import { uploadAvatar } from '../Middleware/upload.js';


const router = express.Router();

const validator = createValidator();

router.post('/register', uploadAvatar, validator.body(VSchema.Register), register);

export default router;