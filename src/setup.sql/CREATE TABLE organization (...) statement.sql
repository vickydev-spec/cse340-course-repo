-- ========================================
-- ORGANIZATION TABLE
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- SERVICE PROJECT TABLE
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
);


-- ========================================
-- CATEGORY TABLE
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


-- ========================================
-- PROJECT CATEGORY JUNCTION TABLE
-- ========================================
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project_category_project
        FOREIGN KEY (project_id)
        REFERENCES service_project (project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_category_category
        FOREIGN KEY (category_id)
        REFERENCES category (category_id)
        ON DELETE CASCADE
);


-- ========================================
-- INSERT SAMPLE ORGANIZATIONS
-- ========================================
INSERT INTO organization
(name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);


-- ========================================
-- INSERT SAMPLE SERVICE PROJECTS
-- ========================================
INSERT INTO service_project
(organization_id, title, description, location, project_date)
VALUES
(
    1,
    'Community Park Restoration',
    'Volunteers will help restore community park areas by planting trees, repairing walking paths, and improving public spaces.',
    'Central Community Park',
    '2026-08-15'
),
(
    2,
    'Urban Garden Expansion',
    'Volunteers will help expand an urban garden and learn about sustainable farming and food production.',
    'GreenHarvest Community Garden',
    '2026-08-22'
),
(
    3,
    'Community Food Distribution',
    'Volunteers will organize and distribute food packages to families and individuals in need.',
    'Unity Community Center',
    '2026-08-29'
);


-- ========================================
-- INSERT SAMPLE CATEGORIES
-- ========================================
INSERT INTO category (name)
VALUES
('Environment'),
('Community Development'),
('Food and Agriculture'),
('Community Support');


-- ========================================
-- ASSOCIATE PROJECTS WITH CATEGORIES
-- ========================================
INSERT INTO project_category
(project_id, category_id)
VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3),
(3, 4);

3. Test the complete database relationships

Run this query:

SELECT
    sp.title AS project_title,
    o.name AS organization_name,
    sp.location,
    sp.project_date,
    c.name AS category_name
FROM service_project sp
JOIN organization o
    ON sp.organization_id = o.organization_id
JOIN project_category pc
    ON sp.project_id = pc.project_id
JOIN category c
    ON pc.category_id = c.category_id
ORDER BY sp.project_id;

This tests all four tables together.

You can also test the relationship using:

SELECT
    service_project.title,
    organization.name
FROM service_project
JOIN organization
    ON service_project.organization_id = organization.organization_id;


What should you do next?
First, verify that your current database contains all the required data.

Run these queries one at a time in pgAdmin 4:

Check organizations
SELECT * FROM organization;

You should have 3 organizations.

Check projects
SELECT * FROM service_project;

You should have 3 projects.

Check categories
SELECT * FROM category;

You should have at least 3 categories.

Check project-category relationships
SELECT * FROM project_category;

You should have relationships such as:

project_id | category_id
1          | 1
1          | 2
2          | 1
2          | 3
3          | 4


-- ========================================
-- Insert Service Projects
-- ========================================

INSERT INTO service_project
    (organization_id, title, description, location, project_date)
VALUES

-- ========================================
-- BrightFuture Builders
-- organization_id = 1
-- ========================================

(1,
 'Community Park Construction',
 'Help build and improve a community park with sustainable materials.',
 'Uyo Community Park',
 '2026-08-05'),

(1,
 'Sustainable Housing Project',
 'Assist with construction activities for affordable and environmentally friendly homes.',
 'Uyo Housing Development',
 '2026-08-12'),

(1,
 'School Renovation Project',
 'Help renovate classrooms and improve learning facilities for local students.',
 'Community Primary School',
 '2026-08-19'),

(1,
 'Clean Water Infrastructure',
 'Support the construction and improvement of clean water facilities in the community.',
 'Community Water Center',
 '2026-08-26'),

(1,
 'Community Garden Construction',
 'Help construct garden spaces that provide food and educational opportunities for residents.',
 'Green Community Center',
 '2026-09-02'),

-- ========================================
-- GreenHarvest Growers
-- organization_id = 2
-- ========================================

(2,
 'Urban Garden Project',
 'Help create and maintain an urban garden to promote local food production.',
 'Central Community Garden',
 '2026-08-06'),

(2,
 'School Garden Education',
 'Teach students about gardening, food production, and environmental sustainability.',
 'Local Secondary School',
 '2026-08-13'),

(2,
 'Community Food Harvest',
 'Help harvest and distribute fresh vegetables to members of the local community.',
 'GreenHarvest Farm',
 '2026-08-20'),

(2,
 'Composting Workshop',
 'Participate in a workshop that teaches residents how to reduce waste through composting.',
 'Community Learning Center',
 '2026-08-27'),

(2,
 'Tree Planting Initiative',
 'Help plant trees and promote environmental sustainability in local neighborhoods.',
 'Community Green Space',
 '2026-09-03'),

-- ========================================
-- UnityServe Volunteers
-- organization_id = 3
-- ========================================

(3,
 'Community Food Drive',
 'Collect and distribute food to families and individuals who need assistance.',
 'UnityServe Community Center',
 '2026-08-07'),

(3,
 'Volunteer Tutoring Program',
 'Provide tutoring support to students in various academic subjects.',
 'Community Learning Center',
 '2026-08-14'),

(3,
 'Senior Citizen Support',
 'Assist elderly community members with basic support and community activities.',
 'UnityServe Senior Center',
 '2026-08-21'),

(3,
 'Neighborhood Cleanup',
 'Work with volunteers to clean and improve public areas in the local community.',
 'Central Neighborhood',
 '2026-08-28'),

(3,
 'Clothing Donation Drive',
 'Collect and distribute donated clothing to individuals and families in need.',
 'UnityServe Community Center',
 '2026-09-04');

I should see at least 15 rows. When i run this:
 SELECT
    project_id,
    organization_id,
    title,
    location,
    project_date
FROM service_project
ORDER BY organization_id, project_id;

Then I run:

SELECT
    organization_id,
    COUNT(*) AS total_projects
FROM service_project
GROUP BY organization_id
ORDER BY organization_id;

You should see something like:

organization_id | total_projects
----------------+---------------
1               | 5
2               | 5
3               | 5

For example, you can add one category to each project that currently has 0:

INSERT INTO project_category (project_id, category_id)
VALUES
(4, 1),
(5, 2),
(6, 3),
(7, 4),
(8, 1),
(9, 2),
(10, 3),
(11, 4),
(12, 1),
(13, 2),
(14, 3),
(15, 4),
(16, 1),
(17, 2),
(18, 3);

Your category IDs are:

category_id	        Category
1	                Environment
2	                Community Development
3	                Food and Agriculture
4	                Community Support

After executing the insert, run your count query again:

SELECT
    sp.project_id,
    sp.title,
    COUNT(pc.category_id) AS category_count
FROM service_project sp
LEFT JOIN project_category pc
    ON sp.project_id = pc.project_id
GROUP BY sp.project_id, sp.title
ORDER BY sp.project_id;

You should then see every project with a category_count of at least 1.

Important
