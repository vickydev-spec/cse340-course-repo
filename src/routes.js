import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, processEditOrganizationForm, showEditOrganizationForm } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm } from "./controllers/projects.js";
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
} from './controllers/categories.js';
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

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route for new project page
router.get('/new-project', showNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/project/:projectId/assign-categories', showAssignCategoriesForm);

// Route to display the edit project form
router.get('/edit-project/:id', showEditProjectForm);

// Route to display the New Category form
router.get("/new-category", showNewCategoryForm);

// Route to display the Edit Category form
router.get("/edit-category/:id", showEditCategoryForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Process Assign Categories form
router.post('/project/:projectId/assign-categories', processAssignCategoriesForm);

// Route to handle the edit project form submission
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// Process New Category form
router.post("/new-category", categoryValidation, processNewCategoryForm);

// Process Edit Category form
router.post("/edit-category/:id", categoryValidation, processEditCategoryForm);

export default router;




