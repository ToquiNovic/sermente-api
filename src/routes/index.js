import { Router } from "express";
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import roleRoutes from './roleRoutes.js';
import surveyRoutes from './surveyRoutes.js';
import surveyAssignmentRoutes from './surveyAssignmentRoutes.js';
import companyRoutes from './companyRoute.js';
import upLoadFileRoute from './upLoadFileRoute.js';
import categoryRoutes from './category.routes.js';
import subCategoryRoutes from './subCategory.routes.js';
// import userCompanyRoutes from './userCompany.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/role', roleRoutes);
router.use('/survey', surveyRoutes);
router.use('/surveyAssignment', surveyAssignmentRoutes);
router.use('/company', companyRoutes);
router.use('/uploadfile', upLoadFileRoute);
router.use('/category', categoryRoutes);
router.use('/subcategory', subCategoryRoutes);
// router.use('/userCompany', userCompanyRoutes);

export default router;