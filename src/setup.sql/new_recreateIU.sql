-- =========================================================
-- CSE 340 - DATABASE SETUP
-- Complete database rebuild
-- =========================================================


-- =========================================================
-- 1. REMOVE EXISTING TABLES
-- =========================================================

DROP TABLE IF EXISTS project_category CASCADE;
DROP TABLE IF EXISTS service_project CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS organization CASCADE;


-- =========================================================
-- 2. CREATE ORGANIZATION TABLE
-- =========================================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- =========================================================
-- 3. CREATE SERVICE PROJECT TABLE
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
-- 4. CREATE CATEGORY TABLE
-- =========================================================

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


-- =========================================================
-- 5. CREATE PROJECT CATEGORY JUNCTION TABLE
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
-- 6. INSERT ORGANIZATIONS
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
    'hello@unityunityserve.org',
    'unityserve-logo.png'
);


-- =========================================================
-- 7. INSERT 18 SERVICE PROJECTS
-- =========================================================

INSERT INTO service_project
    (organization_id, title, description, location, project_date)
VALUES

-- ---------------------------------------------------------
-- BrightFuture Builders - Organization 1
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
-- GreenHarvest Growers - Organization 2
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
-- UnityServe Volunteers - Organization 3
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
),

(
    3,
    'Community Health Outreach',
    'Help volunteers provide health information and basic support to members of the local community.',
    'UnityServe Community Center',
    '2026-09-11'
),

(
    3,
    'Community Skills Workshop',
    'Assist with a community workshop that teaches useful skills and supports local residents.',
    'UnityServe Learning Center',
    '2026-09-18'
);


-- =========================================================
-- 8. INSERT CATEGORIES
-- =========================================================

INSERT INTO category (name)
VALUES
    ('Environment'),
    ('Community Development'),
    ('Food and Agriculture'),
    ('Community Support');


-- =========================================================
-- 9. ASSIGN CATEGORIES TO PROJECTS
-- =========================================================

INSERT INTO project_category
    (project_id, category_id)
VALUES

-- Project 1
(1, 1),
(1, 2),

-- Project 2
(2, 2),

-- Project 3
(3, 2),

-- Project 4
(4, 2),

-- Project 5
(5, 1),

-- Project 6
(6, 1),

-- Project 7
(7, 3),

-- Project 8
(8, 3),

-- Project 9
(9, 3),

-- Project 10
(10, 1),

-- Project 11
(11, 1),

-- Project 12
(12, 4),

-- Project 13
(13, 4),

-- Project 14
(14, 4),

-- Project 15
(15, 1),

-- Project 16
(16, 4),

-- Project 17
(17, 4),

-- Project 18
(18, 2);


-- =========================================================
-- 10. VERIFY ORGANIZATIONS
-- =========================================================

SELECT *
FROM organization
ORDER BY organization_id;


-- =========================================================
-- 11. VERIFY PROJECTS
-- =========================================================

SELECT
    project_id,
    organization_id,
    title,
    project_date
FROM service_project
ORDER BY project_id;


-- =========================================================
-- 12. VERIFY CATEGORIES
-- =========================================================

SELECT *
FROM category
ORDER BY category_id;


-- =========================================================
-- 13. VERIFY PROJECT-CATEGORY RELATIONSHIPS
-- =========================================================

SELECT *
FROM project_category
ORDER BY project_id, category_id;


//* SQL statement to create a table named roles *//
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Verify the data was inserted
SELECT * FROM roles;

//* SQL statement to create a table named users */
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES roles (role_id)
);



-- Insert a test user
INSERT INTO users (username, email, password_hash, role_id) 
VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1);

-- Join users and roles to see complete information
SELECT u.user_id, u.useername, u.email, r.role_name, r.role_description
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- Delete the test user
DELETE FROM users WHERE email = 'test@example.com';

UPDATE public.users
SET password_hash = '$2b$10$2zYO1IkMpJQGZEoGDlSLQ.P4A/np30w1Bc0Dy3o1QWq0/Q0zBzuQe'
WHERE email = 'admin@example.com';