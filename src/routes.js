import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from "./controllers/projects.js";
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';


const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get("/categories", showCategoriesPage);

// Route for organization details page, project details page, category details page
router.get("/category/:id", showCategoryDetailsPage);
router.get("/project/:id", showProjectDetailsPage);
router.get("/organization/:id", showOrganizationDetailsPage);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;




