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

import {
    processAddVolunteer,
    processRemoveVolunteer
} from "./controllers/volunteers.js";

import { testErrorPage } from "./controllers/errors.js";


const router = express.Router();


// ============================================================
// PUBLIC ROUTES
// ============================================================

router.get("/", showHomePage);

router.get(
    "/organizations",
    showOrganizationsPage
);

router.get(
    "/projects",
    showProjectsPage
);

router.get(
    "/categories",
    showCategoriesPage
);

router.get(
    "/category/:id",
    showCategoryDetailsPage
);

router.get(
    "/project/:id",
    showProjectDetailsPage
);

router.get(
    "/organization/:id",
    showOrganizationDetailsPage
);

router.get(
    "/test-error",
    testErrorPage
);


// ============================================================
// ORGANIZATION ADMIN ROUTES
// ============================================================

router.get(
    "/new-organization",
    requireRole("admin"),
    showNewOrganizationForm
);

router.post(
    "/new-organization",
    requireRole("admin"),
    organizationValidation,
    processNewOrganizationForm
);

router.get(
    "/edit-organization/:id",
    requireRole("admin"),
    showEditOrganizationForm
);

router.post(
    "/edit-organization/:id",
    requireRole("admin"),
    organizationValidation,
    processEditOrganizationForm
);


// ============================================================
// PROJECT ADMIN ROUTES
// ============================================================

router.get(
    "/new-project",
    requireRole("admin"),
    showNewProjectForm
);

router.post(
    "/new-project",
    requireRole("admin"),
    projectValidation,
    processNewProjectForm
);

router.get(
    "/edit-project/:id",
    requireRole("admin"),
    showEditProjectForm
);

router.post(
    "/edit-project/:id",
    requireRole("admin"),
    projectValidation,
    processEditProjectForm
);

router.get(
    "/project/:projectId/assign-categories",
    requireRole("admin"),
    showAssignCategoriesForm
);

router.post(
    "/project/:projectId/assign-categories",
    requireRole("admin"),
    processAssignCategoriesForm
);


// ============================================================
// WEEK 6 VOLUNTEER ROUTES
// ============================================================

// Add logged-in user as volunteer
router.get(
    "/project/:projectId/volunteer",
    requireLogin,
    processAddVolunteer
);


// Remove logged-in user as volunteer
router.get(
    "/project/:projectId/remove-volunteer",
    requireLogin,
    processRemoveVolunteer
);


// ============================================================
// CATEGORY ADMIN ROUTES
// ============================================================

router.get(
    "/new-category",
    requireRole("admin"),
    showNewCategoryForm
);

router.post(
    "/new-category",
    requireRole("admin"),
    categoryValidation,
    processNewCategoryForm
);

router.get(
    "/edit-category/:id",
    requireRole("admin"),
    showEditCategoryForm
);

router.post(
    "/edit-category/:id",
    requireRole("admin"),
    categoryValidation,
    processEditCategoryForm
);


// ============================================================
// REGISTRATION
// ============================================================

router.get(
    "/register",
    showUserRegistrationForm
);

router.post(
    "/register",
    registrationValidation,
    processUserRegistrationForm
);


// ============================================================
// LOGIN
// ============================================================

router.get(
    "/login",
    showLoginForm
);

router.post(
    "/login",
    processLoginForm
);

router.get(
    "/logout",
    processLogout
);


// ============================================================
// DASHBOARD
// ============================================================

router.get(
    "/dashboard",
    requireLogin,
    showDashboard
);


// ============================================================
// ADMIN USERS PAGE
// ============================================================

router.get(
    "/users",
    requireRole("admin"),
    showUsersPage
);


export default router;