// Import needed model functions
import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from "../models/projects.js";

import { getCategoriesByProjectId } from "../models/categories.js";

import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from "express-validator";


// Define validation rule for projects
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// Number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;


// Display upcoming service projects (// Controller for the Projects page)
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(
            NUMBER_OF_UPCOMING_PROJECTS
        );

        res.render("projects", {
            title: "Upcoming Service Projects",
            projects,
        });
    } catch (error) {
        next(error);
    }
};

// Display one project and its categories (// Controller for a single Project page)

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const project_id = req.params.id;

        const project = await getProjectDetails(project_id);

        if (!project) {
            return next({
                status: 404,
                message: "Project not found",
            });
        }

        const categories = await getCategoriesByProjectId(project_id);

        res.render("project", {
            title: project.title,
            project,
            categories,
        });
    } catch (error) {
        next(error);
    }
};

// Show the New Project form
const showNewProjectForm = async (req, res) => {

    const organizations = await getAllOrganizations();

    const title = "Add New Service Project";

    res.render("new-project", {
        title,
        organizations,
        formData: {}
    });

};

// Process the New Project form
const processNewProjectForm = async (req, res, next) => {

    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {

        // Store validation errors
        results.array().forEach(error => {
            req.flash("error", error.msg);
        });

        // Reload organizations for the dropdown
        const organizations = await getAllOrganizations();

        // Redisplay the form with the user's previous values
        return res.render("new-project", {
            title: "Add New Service Project",
            organizations,
            formData: req.body
        });
    }

    // Get the form data
    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body;

    try {

        // Create the new project
        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        // Success message
        req.flash(
            "success",
            "New service project created successfully!"
        );

        // Redirect to the project details page
        res.redirect(`/project/${newProjectId}`);

    } catch (error) {

        console.error(error);

        req.flash(
            "error",
            "Unable to create the project. Please try again."
        );

        const organizations = await getAllOrganizations();

        res.render("new-project", {
            title: "Add New Service Project",
            organizations,
            formData: req.body
        });

    }

};

// edit project form controller
const showEditProjectForm = async (req, res) => {

    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    const organizations =
        await getAllOrganizations();

    res.render("edit-project", {

        title: "Edit Service Project",

        project,

        organizations

    });

};

// process edit project form controller
const processEditProjectForm = async (req, res, next) => {

    // Check validation
    const results = validationResult(req);

    if (!results.isEmpty()) {

        // Reload organizations for the dropdown
        const organizations = await getAllOrganizations();

        // Keep the user's entered values
        const project = {
            project_id: req.params.id,
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            date: req.body.date,
            organization_id: Number(req.body.organizationId)
        };

        // Store validation messages
        results.array().forEach(error => {
            req.flash("error", error.msg);
        });

        return res.render("edit-project", {
            title: "Edit Service Project",
            project,
            organizations
        });
    }

    const projectId = req.params.id;

    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body;

    try {

        await updateProject(
            projectId,
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash(
            "success",
            "Project updated successfully!"
        );

        res.redirect(`/project/${projectId}`);

    } catch (error) {

        next(error);

    }
};


// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};

