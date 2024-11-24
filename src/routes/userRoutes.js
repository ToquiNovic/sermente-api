import { Router } from 'express';
import { createUser, getUser, getAllUsers } from '../controllers/userController.js';

const router = Router();

router.post('/', createUser);
router.get('/:id', getUser);
router.get('/', getAllUsers);


export default router;