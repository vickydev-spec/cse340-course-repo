import db from "./db.js";


// ============================================================
// ADD VOLUNTEER
// ============================================================

const addVolunteer = async (userId, projectId) => {

    const sql = `
        INSERT INTO public.project_volunteer
            (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id)
        DO NOTHING
        RETURNING user_id, project_id;
    `;

    const result = await db.query(sql, [
        userId,
        projectId
    ]);

    return result.rows[0];
};


// ============================================================
// REMOVE VOLUNTEER
// ============================================================

const removeVolunteer = async (userId, projectId) => {

    const sql = `
        DELETE FROM public.project_volunteer
        WHERE user_id = $1
          AND project_id = $2;
    `;

    const result = await db.query(sql, [
        userId,
        projectId
    ]);

    return result.rowCount;
};


// ============================================================
// GET VOLUNTEER PROJECTS
// ============================================================

const getVolunteerProjects = async (userId) => {

    const sql = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            sp.project_date AS date,
            o.organization_id,
            o.name AS organization_name
        FROM public.project_volunteer AS pv

        INNER JOIN public.service_project AS sp
            ON pv.project_id = sp.project_id

        INNER JOIN public.organization AS o
            ON sp.organization_id = o.organization_id

        WHERE pv.user_id = $1

        ORDER BY sp.project_date ASC;
    `;

    const result = await db.query(sql, [
        userId
    ]);

    return result.rows;
};


// ============================================================
// CHECK VOLUNTEER STATUS
// ============================================================

const isVolunteer = async (userId, projectId) => {

    const sql = `
        SELECT
            user_id,
            project_id
        FROM public.project_volunteer
        WHERE user_id = $1
          AND project_id = $2;
    `;

    const result = await db.query(sql, [
        userId,
        projectId
    ]);

    return result.rows.length > 0;
};


// ============================================================
// EXPORTS
// ============================================================

export {
    addVolunteer,
    removeVolunteer,
    getVolunteerProjects,
    isVolunteer
};