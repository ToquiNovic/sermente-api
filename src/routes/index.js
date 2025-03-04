import { Router } from "express";
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import roleRoutes from './roleRoutes.js';
import surveyRoutes from './surveyRoutes.js';
import typeSurveyRoutes from './typeSurveyRoutes.js';
import surveyAssignmentRoutes from './surveyAssignmentRoutes.js';
import companyRoutes from './companyRoute.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/role', roleRoutes);
router.use('/survey', surveyRoutes);
router.use('/typeSurvey', typeSurveyRoutes);
router.use('/surveyAssignment', surveyAssignmentRoutes);
router.use('/company', companyRoutes);

export default router;