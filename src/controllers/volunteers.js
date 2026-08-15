import {
    addVolunteer,
    removeVolunteer
} from "../models/volunteers.js";


// ============================================================
// ADD VOLUNTEER
// ============================================================

const processAddVolunteer = async (req, res, next) => {

    try {

        // Get the logged-in user's ID
        const userId = req.session.user.user_id;

        // Get the project ID from the URL
        const projectId = parseInt(req.params.projectId);

        // Add the user as a volunteer
        await addVolunteer(
            userId,
            projectId
        );

        // Success message
        req.flash(
            "success",
            "You are now volunteering for this project."
        );

        // Return to project details
        res.redirect(
            `/project/${projectId}`
        );

    } catch (error) {

        next(error);

    }
};


// ============================================================
// REMOVE VOLUNTEER
// ============================================================

const processRemoveVolunteer = async (req, res, next) => {

    try {

        // Get the logged-in user's ID
        const userId = req.session.user.user_id;

        // Get the project ID from the URL
        const projectId = parseInt(req.params.projectId);

        // Remove the volunteer
        await removeVolunteer(
            userId,
            projectId
        );

        // Success message
        req.flash(
            "success",
            "You are no longer volunteering for this project."
        );

        // Return to project details
        res.redirect(
            `/project/${projectId}`
        );

    } catch (error) {

        next(error);

    }
};


// ============================================================
// EXPORT CONTROLLER FUNCTIONS
// ============================================================

export {
    processAddVolunteer,
    processRemoveVolunteer
};