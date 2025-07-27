import { Router } from "express";
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import roleRoutes from './roleRoutes.js';
import surveyRoutes from './surveyRoutes.js';
import surveyAssignmentRoutes from './surveyAssignmentRoutes.js';
import companyRoutes from './companyRoute.js';
import upLoadFileRoute from './upLoadFileRoute.js';
import dimensionRoutes from './dimension.routes.js';
import questionRoutes from './question.routes.js';
import optionRoutes from './option.routes.js';
import answerRoutes from './answer.routes.js';
import factorRoutes from './factor.routes.js';
import domainRoutes from './domain.routes.js';
// import userCompanyRoutes from './userCompany.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/role', roleRoutes);
router.use('/survey', surveyRoutes);
router.use('/surveyAssignment', surveyAssignmentRoutes);
router.use('/company', companyRoutes);
router.use('/uploadfile', upLoadFileRoute);
router.use('/dimension', dimensionRoutes);
router.use('/question', questionRoutes);
router.use('/answer', answerRoutes);
router.use('/option', optionRoutes);
router.use('/factor', factorRoutes);
router.use('/domain', domainRoutes);
// router.use('/userCompany', userCompanyRoutes);

export default router;