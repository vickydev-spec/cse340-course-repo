import db from "./db.js";

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category;
    `;

    const result = await db.query(query);

    return result.rows;
};


const getCategoryById = async (id) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};


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


export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId
};