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
// creatProject table for creating a new project in the database
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO public.service_project (title, description, location, project_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

// updateproject function to update an existing project in the database
const updateProject = async (
    projectId,
    title,
    description,
    location,
    date,
    organizationId
) => {

    const query = `
        UPDATE public.service_project
        SET
            title = $1,
            description = $2,
            location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const queryParams = [
        title,
        description,
        location,
        date,
        organizationId,
        projectId
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error("Project not found.");
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
        console.log(
            "Updated Project:",
            result.rows[0].project_id
        );
    }

    return result.rows[0].project_id;

};

// Export the model functions
export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
};

