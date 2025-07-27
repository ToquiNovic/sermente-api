import { Router } from 'express';
import {
    getAllAnswers,
    getAnswerById,
    getAnswerByUserCompanyId,
    getAnswerByOptionId,
    createAnswer,
    updateAnswer,
    deleteAnswer
 } from '../controllers/answer.controller.js'

const router = Router();

router.get('/', getAllAnswers);
router.get('/:id', getAnswerById);
router.get('/userCompany/:userCompanyId', getAnswerByUserCompanyId);
router.get('/option/:optionId', getAnswerByOptionId);
router.post('/', createAnswer);
router.put('/:id', updateAnswer);
router.delete('/:id', deleteAnswer);

export default router;