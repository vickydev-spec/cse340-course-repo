import db from "./db.js";
// Get all categories from the database
const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category;
    `;

    const result = await db.query(query);

    return result.rows;
};

// Get a category by its ID from the database
const getCategoryById = async (id) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};

// Get all categories assigned to a specific(one) project
const getCategoriesByProjectId = async (project_id) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM public.category AS c
        INNER JOIN public.project_category AS pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const result = await db.query(query, [project_id]);

    return result.rows;
};

// Get all projects assigned to a specific(one) category
const getProjectsByCategoryId = async (category_id) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date
        FROM public.service_project AS sp
        INNER JOIN public.project_category AS pc
            ON sp.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.project_date;
    `;

    const result = await db.query(query, [category_id]);

    return result.rows;
};

//create a function to assign a new category to a project
/**
 * Create a new category
 * @param {string} name
 */
const createCategory = async (name) => {

    const query = `
        INSERT INTO public.category
            (name)
        VALUES
            ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [name]);

    if (result.rows.length === 0) {
        throw new Error("Failed to create category.");
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
        console.log(
            "Created Category:",
            result.rows[0].category_id
        );
    }

    return result.rows[0].category_id;
};


/**
 * Update an existing category
 * @param {number} categoryId
 * @param {string} name
 */
const updateCategory = async (
    categoryId,
    name
) => {

    const query = `
        UPDATE public.category
        SET
            name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const result = await db.query(
        query,
        [
            name,
            categoryId
        ]
    );

    if (result.rows.length === 0) {
        throw new Error("Category not found.");
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
        console.log(
            "Updated Category:",
            result.rows[0].category_id
        );
    }

    return result.rows[0].category_id;
};

/**
 * Assign one category to one project.
 * @param {number} projectId
 * @param {number} categoryId
 */
const assignCategoryToProject = async (projectId, categoryId) => {

    const query = `
        INSERT INTO public.project_category
        (project_id, category_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [
        projectId,
        categoryId
    ]);

};
/**
 * Update all category assignments for one project.
 * @param {number} projectId
 * @param {Array} categoryIds
 */
const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM public.project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    if (categoryIds) {
        for (const categoryId of categoryIds) {
            await assignCategoryToProject(projectId, categoryId);
        }

    }

}

export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    createCategory,
    updateCategory,
    updateCategoryAssignments
};