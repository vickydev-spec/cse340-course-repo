// Import needed model functions
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from "../models/categories.js";


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


// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage
};