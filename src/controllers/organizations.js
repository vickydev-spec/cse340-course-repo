// Import any needed model functions
import { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),

    body('contactEmail')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

// Define any controller functions
// Show all organizations
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

// Show organization details
const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', { title, organizationDetails, projects });
};
//show form
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    // Render the form with empty values the first time it loads
    res.render('new-organization', {
        title,
        name: '',
        description: '',
        contactEmail: ''
    });
};

// Process form
const processNewOrganizationForm = async (req, res) => {

    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {

        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Re-render the form and keep the user's entered values
        return res.render('new-organization', {
            title: 'Add New Organization',
            name: req.body.name,
            description: req.body.description,
            contactEmail: req.body.contactEmail
        });
    }

    const { name, description, contactEmail } = req.body;

    // Use the placeholder logo for all new organizations
    const logoFilename = 'placeholder-logo.png';

    const organizationId = await createOrganization(
        name,
        description,
        contactEmail,
        logoFilename
    );

    // Store a success flash message
    req.flash('success', 'Organization added successfully!');

    // Redirect to the new organization details page
    res.redirect(`/organization/${organizationId}`);
};

//show editorganization
const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    const title = 'Edit Organization';
    res.render('edit-organization', { title, organizationDetails });
};


// Process the edit organization form
const processEditOrganizationForm = async (req, res) => {

    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {

        // Get the organization again so the form can be re-rendered
        const organizationDetails = {
            organization_id: req.params.id,
            name: req.body.name,
            description: req.body.description,
            contact_email: req.body.contactEmail,
            logo_filename: req.body.logoFilename
        };

        // Store each validation error as a flash message
        results.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.render("edit-organization", {
            title: "Edit Organization",
            organizationDetails
        });
    }

    const organizationId = req.params.id;

    const {
        name,
        description,
        contactEmail,
        logoFilename
    } = req.body;

    await updateOrganization(
        organizationId,
        name,
        description,
        contactEmail,
        logoFilename
    );

    req.flash(
        "success",
        "Organization updated successfully!"
    );

    res.redirect(`/organization/${organizationId}`);
};

// Export any controller functions
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
};
