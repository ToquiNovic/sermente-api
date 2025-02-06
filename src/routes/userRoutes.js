import { Router } from 'express';
import { createUser, getUser, getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

router.post('/', createUser);
router.get('/:id', getUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;