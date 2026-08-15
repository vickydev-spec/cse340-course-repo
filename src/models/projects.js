import db from "./db.js";


// ============================================================
// GET ALL UPCOMING PROJECTS
// ============================================================

const getUpcomingProjects = async (numberOfProjects) => {

    const sql = `
        SELECT
            sp.project_id,
            sp.organization_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            sp.project_date AS date,
            o.name AS organization_name
        FROM public.service_project AS sp
        INNER JOIN public.organization AS o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date ASC
        LIMIT $1;
    `;

    const result = await db.query(sql, [numberOfProjects]);

    return result.rows;
};


// ============================================================
// GET PROJECTS BY ORGANIZATION
// ============================================================

const getProjectsByOrganizationId = async (organizationId) => {

    const sql = `
        SELECT
            sp.project_id,
            sp.organization_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            sp.project_date AS date
        FROM public.service_project AS sp
        WHERE sp.organization_id = $1
        ORDER BY sp.project_date ASC;
    `;

    const result = await db.query(sql, [organizationId]);

    return result.rows;
};


// ============================================================
// GET PROJECT DETAILS
// ============================================================

const getProjectDetails = async (projectId) => {

    const sql = `
        SELECT
            sp.project_id,
            sp.organization_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            sp.project_date AS date,
            o.name AS organization_name
        FROM public.service_project AS sp
        INNER JOIN public.organization AS o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;

    const result = await db.query(sql, [projectId]);

    return result.rows[0];
};


// ============================================================
// CREATE NEW PROJECT
// ============================================================

const createProject = async (
    title,
    description,
    location,
    date,
    organizationId
) => {

    const sql = `
        INSERT INTO public.service_project
        (
            organization_id,
            title,
            description,
            location,
            project_date
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const result = await db.query(sql, [
        organizationId,
        title,
        description,
        location,
        date
    ]);

    return result.rows[0].project_id;
};


// ============================================================
// UPDATE PROJECT
// ============================================================

const updateProject = async (
    projectId,
    title,
    description,
    location,
    date,
    organizationId
) => {

    const sql = `
        UPDATE public.service_project
        SET
            organization_id = $1,
            title = $2,
            description = $3,
            location = $4,
            project_date = $5
        WHERE project_id = $6;
    `;

    const result = await db.query(sql, [
        organizationId,
        title,
        description,
        location,
        date,
        projectId
    ]);

    return result.rowCount;
};


// ============================================================
// EXPORT ALL PROJECT MODEL FUNCTIONS
// ============================================================

export {
    getUpcomingProjects,
    getProjectsByOrganizationId,
    getProjectDetails,
    createProject,
    updateProject
};