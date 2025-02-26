import { Router } from 'express';
import { createSurvey, getSurvey, getAllSurveys, updateSurvey, deleteSurvey, addDependencies, removeDependencies } from '../controllers/surveyController.js';

const router = Router();

router.post('/', createSurvey);
router.get('/:id', getSurvey);
router.get('/', getAllSurveys);
router.put('/:id', updateSurvey);
router.delete('/:id', deleteSurvey);
router.put('/:id/add-dependencies', addDependencies);
router.put('/:id/remove-dependencies', removeDependencies);

export default router;