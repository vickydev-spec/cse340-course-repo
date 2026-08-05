// Import needed model functions
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    createCategory,
    updateCategory,
    updateCategoryAssignments
} from "../models/categories.js";
// Import project model
import { getProjectDetails } from "../models/projects.js";

// Import validation tools
import { body, validationResult } from "express-validator";

// Define validation  and sanitalization for categories
// Validation rules for category forms
const categoryValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required.")
        .isLength({ min: 3, max: 100 })
        .withMessage(
            "Category name must be between 3 and 100 characters."
        )

];

// Display all categories
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = "Service Categories";

        res.render("categories", {
            title,
            categories
        });
    } catch (error) {
        next(error);
    }
};


// Display one category and its projects
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const category_id = req.params.id;

        const category = await getCategoryById(category_id);

        if (!category) {
            return next({
                status: 404,
                message: "Category not found"
            });
        }

        const projects = await getProjectsByCategoryId(category_id);

        res.render("category", {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        next(error);
    }
};

//show assign categories form
const showAssignCategoriesForm = async (req, res) => {

    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);

    const categories = await getAllCategories();

    const assignedCategories =
        await getCategoriesByProjectId(projectId);
    // Display the New Category form
    res.render("assign-categories", {

        title: "Assign Categories to Project",

        projectId,

        projectDetails,

        categories,

        assignedCategories

    });



};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const categoryIds = req.body.categoryIds || [];

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

// Process New Category form
// Process New Category form
const processNewCategoryForm = async (req, res, next) => {

    const results = validationResult(req);

    if (!results.isEmpty()) {

        results.array().forEach(error => {

            req.flash("error", error.msg);

        });

        return res.render("new-category", {

            title: "Create New Category",

            formData: req.body

        });

    }

    try {

        const { name } = req.body;

        const categoryId =
            await createCategory(name);

        req.flash(

            "success",

            "Category created successfully!"

        );

        res.redirect(`/category/${categoryId}`);

    }

    catch (error) {

        console.error(error);

        req.flash(

            "error",

            "Unable to create category."

        );

        res.render("new-category", {

            title: "Create New Category",

            formData: req.body

        });

    }

};

// Display Edit Category form
const showEditCategoryForm = async (req, res) => {

    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    res.render("edit-category", {

        title: "Edit Category",

        category

    });

};

// show new category form
const showNewCategoryForm = async (req, res) => {

    res.render("new-category", {

        title: "Create New Category",

        formData: {}

    });

};

// Process Edit Category form
const processEditCategoryForm = async (req, res, next) => {

    const results = validationResult(req);

    if (!results.isEmpty()) {

        const category = {

            category_id: req.params.id,

            name: req.body.name

        };

        results.array().forEach(error => {

            req.flash("error", error.msg);

        });

        return res.render("edit-category", {

            title: "Edit Category",

            category

        });

    }

    try {

        const categoryId = req.params.id;

        const { name } = req.body;

        await updateCategory(

            categoryId,

            name

        );

        req.flash(

            "success",

            "Category updated successfully!"

        );

        res.redirect(`/category/${categoryId}`);

    }

    catch (error) {

        console.error(error);

        req.flash(

            "error",

            "Unable to update category."

        );

        const category = {

            category_id: req.params.id,

            name: req.body.name

        };

        res.render("edit-category", {

            title: "Edit Category",

            category

        });

    }

};

// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};