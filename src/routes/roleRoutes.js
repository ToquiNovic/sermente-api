import { Router } from 'express';
import {
  createRole,
  getRole,
  getAllRoles,
  updateRole,
  deleteRole,
} from '../controllers/roleController.js';

const router = Router();

router.post('/', createRole);
router.get('/:id', getRole);
router.get('/', getAllRoles);
router.patch('/:id', updateRole);
router.delete('/:id', deleteRole);

export default router;