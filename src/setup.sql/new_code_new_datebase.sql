-- =========================================================
-- CSE 340 DATABASE SETUP
-- Week 05 - Re-create Render Database
-- =========================================================


-- =========================================================
-- 1. ORGANIZATION TABLE
-- =========================================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- =========================================================
-- 2. SERVICE PROJECT TABLE
-- =========================================================

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


-- =========================================================
-- 3. CATEGORY TABLE
-- =========================================================

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


-- =========================================================
-- 4. PROJECT CATEGORY JUNCTION TABLE
-- =========================================================

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


-- =========================================================
-- 5. INSERT SAMPLE ORGANIZATIONS
-- =========================================================

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


-- =========================================================
-- 6. INSERT SERVICE PROJECTS
-- =========================================================
-- Organization 1 = BrightFuture Builders
-- Organization 2 = GreenHarvest Growers
-- Organization 3 = UnityServe Volunteers
--
-- These will create project IDs 1 through 18.
-- =========================================================

INSERT INTO service_project
    (organization_id, title, description, location, project_date)
VALUES

-- ---------------------------------------------------------
-- BrightFuture Builders
-- organization_id = 1
-- ---------------------------------------------------------

(
    1,
    'Community Park Restoration',
    'Volunteers will help restore community park areas by planting trees, repairing walking paths, and improving public spaces.',
    'Central Community Park',
    '2026-08-15'
),

(
    1,
    'Community Park Construction',
    'Help build and improve a community park with sustainable materials.',
    'Uyo Community Park',
    '2026-08-05'
),

(
    1,
    'Sustainable Housing Project',
    'Assist with construction activities for affordable and environmentally friendly homes.',
    'Uyo Housing Development',
    '2026-08-12'
),

(
    1,
    'School Renovation Project',
    'Help renovate classrooms and improve learning facilities for local students.',
    'Community Primary School',
    '2026-08-19'
),

(
    1,
    'Clean Water Infrastructure',
    'Support the construction and improvement of clean water facilities in the community.',
    'Community Water Center',
    '2026-08-26'
),

(
    1,
    'Community Garden Construction',
    'Help construct garden spaces that provide food and educational opportunities for residents.',
    'Green Community Center',
    '2026-09-02'
),


-- ---------------------------------------------------------
-- GreenHarvest Growers
-- organization_id = 2
-- ---------------------------------------------------------

(
    2,
    'Urban Garden Project',
    'Help create and maintain an urban garden to promote local food production.',
    'Central Community Garden',
    '2026-08-06'
),

(
    2,
    'School Garden Education',
    'Teach students about gardening, food production, and environmental sustainability.',
    'Local Secondary School',
    '2026-08-13'
),

(
    2,
    'Community Food Harvest',
    'Help harvest and distribute fresh vegetables to members of the local community.',
    'GreenHarvest Farm',
    '2026-08-20'
),

(
    2,
    'Composting Workshop',
    'Participate in a workshop that teaches residents how to reduce waste through composting.',
    'Community Learning Center',
    '2026-08-27'
),

(
    2,
    'Tree Planting Initiative',
    'Help plant trees and promote environmental sustainability in local neighborhoods.',
    'Community Green Space',
    '2026-09-03'
),


-- ---------------------------------------------------------
-- UnityServe Volunteers
-- organization_id = 3
-- ---------------------------------------------------------

(
    3,
    'Community Food Drive',
    'Collect and distribute food to families and individuals who need assistance.',
    'UnityServe Community Center',
    '2026-08-07'
),

(
    3,
    'Volunteer Tutoring Program',
    'Provide tutoring support to students in various academic subjects.',
    'Community Learning Center',
    '2026-08-14'
),

(
    3,
    'Senior Citizen Support',
    'Assist elderly community members with basic support and community activities.',
    'UnityServe Senior Center',
    '2026-08-21'
),

(
    3,
    'Neighborhood Cleanup',
    'Work with volunteers to clean and improve public areas in the local community.',
    'Central Neighborhood',
    '2026-08-28'
),

(
    3,
    'Clothing Donation Drive',
    'Collect and distribute donated clothing to individuals and families in need.',
    'UnityServe Community Center',
    '2026-09-04'
);


-- =========================================================
-- 7. INSERT CATEGORIES
-- =========================================================

INSERT INTO category (name)
VALUES
    ('Environment'),
    ('Community Development'),
    ('Food and Agriculture'),
    ('Community Support');


-- =========================================================
-- 8. ASSIGN CATEGORIES TO PROJECTS
-- =========================================================
-- Category IDs:
--
-- 1 = Environment
-- 2 = Community Development
-- 3 = Food and Agriculture
-- 4 = Community Support
--
-- Project IDs:
-- 1 - 6   = BrightFuture Builders
-- 7 - 11  = GreenHarvest Growers
-- 12 - 16 = UnityServe Volunteers
-- =========================================================

INSERT INTO project_category
    (project_id, category_id)
VALUES

-- Project 1: Community Park Restoration
(1, 1),
(1, 2),

-- Project 2: Community Park Construction
(2, 2),

-- Project 3: Sustainable Housing Project
(3, 2),

-- Project 4: School Renovation Project
(4, 2),

-- Project 5: Clean Water Infrastructure
(5, 1),

-- Project 6: Community Garden Construction
(6, 3),

-- Project 7: Urban Garden Project
(7, 3),

-- Project 8: School Garden Education
(8, 3),

-- Project 9: Community Food Harvest
(9, 3),

-- Project 10: Composting Workshop
(10, 1),

-- Project 11: Tree Planting Initiative
(11, 1),

-- Project 12: Community Food Drive
(12, 4),

-- Project 13: Volunteer Tutoring Program
(13, 4),

-- Project 14: Senior Citizen Support
(14, 4),

-- Project 15: Neighborhood Cleanup
(15, 1),

-- Project 16: Clothing Donation Drive
(16, 4);


-- =========================================================
-- 9. VERIFY THE DATA
-- =========================================================

SELECT * FROM organization;

SELECT * FROM service_project;

SELECT * FROM category;

SELECT * FROM project_category;