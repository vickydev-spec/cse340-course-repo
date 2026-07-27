import db from "./db.js";

const getAllProjects = async () => {
    const query = `
        SELECT project_id, organization_id, title, description, location, project_date
        FROM public.service_project;
    `;

    const result = await db.query(query);

    return result.rows;
};


const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date
        FROM public.service_project
        WHERE organization_id = $1
        ORDER BY project_date;
    `;

    const queryParams = [organizationId];

    console.log("QUERY BEING EXECUTED:");
    console.log(query);

    const result = await db.query(query, queryParams);

    return result.rows;
};


/**
 * Get the next upcoming service projects.
 * @param {number} number_of_projects - Number of projects to return
 * @returns {Array} Upcoming service projects
 */
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
          sp.project_id,
          sp.title,
          sp.description,
          sp.project_date AS date,
          sp.location,
          o.organization_id,
          o.name AS organization_name
        FROM public.service_project AS sp
        INNER JOIN public.organization AS o
          ON sp.organization_id = o.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date ASC
        LIMIT $1;
    `;

    const result = await db.query(query, [number_of_projects]);

    return result.rows;
};


/**
 * Get one service project by ID.
 * @param {number} id - Service project ID
 * @returns {Object} Service project details
 */
const getProjectDetails = async (id) => {
    const query = `
        SELECT
          sp.project_id,
          sp.title,
          sp.description,
          sp.project_date AS date,
          sp.location,
          o.organization_id,
          o.name AS organization_name
        FROM public.service_project AS sp
        INNER JOIN public.organization AS o
          ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};


// Export the model functions
export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails
};

