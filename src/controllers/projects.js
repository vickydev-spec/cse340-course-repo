// Import needed model functions
import {
    getUpcomingProjects,
    getProjectDetails
} from "../models/projects.js";

import {
    getCategoriesByProjectId
} from "../models/categories.js";


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

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage
};

