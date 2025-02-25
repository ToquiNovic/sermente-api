import { Router } from 'express';
import { createUser, getUser, getAllUsers, updateUser, deleteUser, assignRoleToUser, removeRoleFromUser, updateState } from '../controllers/userController.js';

const router = Router();

router.post('/', createUser);
router.get('/:id', getUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/assign-role', assignRoleToUser);
router.post("/:id/remove-role", removeRoleFromUser);
router.put("/:id/state", updateState);

export default router;