import express from "express";

import { showHomePage } from "./controllers/index.js";

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    processEditOrganizationForm,
    showEditOrganizationForm
} from "./controllers/organizations.js";

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from "./controllers/projects.js";

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
} from "./controllers/categories.js";

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    registrationValidation,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
} from "./controllers/users.js";

import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();


/* ================================
   PUBLIC ROUTES
================================ */

// Home page
router.get("/", showHomePage);

// Organizations list
router.get("/organizations", showOrganizationsPage);

// Projects list
router.get("/projects", showProjectsPage);

// Categories list
router.get("/categories", showCategoriesPage);

// Category details
router.get("/category/:id", showCategoryDetailsPage);

// Project details
router.get("/project/:id", showProjectDetailsPage);

// Organization details
router.get("/organization/:id", showOrganizationDetailsPage);

// Test error page
router.get("/test-error", testErrorPage);


/* ================================
   ORGANIZATION ADMIN ROUTES
================================ */

// Show new organization form
router.get(
    "/new-organization",
    requireRole("admin"),
    showNewOrganizationForm
);

// Process new organization form
router.post(
    "/new-organization",
    requireRole("admin"),
    organizationValidation,
    processNewOrganizationForm
);

// Show edit organization form
router.get(
    "/edit-organization/:id",
    requireRole("admin"),
    showEditOrganizationForm
);

// Process edit organization form
router.post(
    "/edit-organization/:id",
    requireRole("admin"),
    organizationValidation,
    processEditOrganizationForm
);


/* ================================
   PROJECT ADMIN ROUTES
================================ */

// Show new project form
router.get(
    "/new-project",
    requireRole("admin"),
    showNewProjectForm
);

// Process new project form
router.post(
    "/new-project",
    requireRole("admin"),
    projectValidation,
    processNewProjectForm
);

// Show edit project form
router.get(
    "/edit-project/:id",
    requireRole("admin"),
    showEditProjectForm
);

// Process edit project form
router.post(
    "/edit-project/:id",
    requireRole("admin"),
    projectValidation,
    processEditProjectForm
);

// Show assign categories form
router.get(
    "/project/:projectId/assign-categories",
    requireRole("admin"),
    showAssignCategoriesForm
);

// Process assign categories form
router.post(
    "/project/:projectId/assign-categories",
    requireRole("admin"),
    processAssignCategoriesForm
);


/* ================================
   CATEGORY ADMIN ROUTES
================================ */

// Show new category form
router.get(
    "/new-category",
    requireRole("admin"),
    showNewCategoryForm
);

// Process new category form
router.post(
    "/new-category",
    requireRole("admin"),
    categoryValidation,
    processNewCategoryForm
);

// Show edit category form
router.get(
    "/edit-category/:id",
    requireRole("admin"),
    showEditCategoryForm
);

// Process edit category form
router.post(
    "/edit-category/:id",
    requireRole("admin"),
    categoryValidation,
    processEditCategoryForm
);


/* ================================
   USER REGISTRATION
================================ */

// Registration page
router.get(
    "/register",
    showUserRegistrationForm
);

// Process registration
router.post(
    "/register",
    registrationValidation,
    processUserRegistrationForm
);


/* ================================
   USER LOGIN
================================ */

// Login page
router.get(
    "/login",
    showLoginForm
);

// Process login
router.post(
    "/login",
    processLoginForm
);

// Logout
router.get(
    "/logout",
    processLogout
);


/* ================================
   PROTECTED DASHBOARD
================================ */

// Dashboard requires a logged-in user
router.get(
    "/dashboard",
    requireLogin,
    showDashboard
);

/* ================================
   ADMIN USERS PAGE
================================ */
// Display all registered users.
// Only administrators can access this page.
router.get(
    "/users",
    requireRole("admin"),
    showUsersPage
);

export default router;