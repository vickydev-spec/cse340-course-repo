import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

import {
    createUser,
    authenticateUser,
    getAllUsers
} from "../models/users.js";

/**
 * Validation rules for registration.
 */
const registrationValidation = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required.")
        .isLength({ min: 3, max: 150 })
        .withMessage(
            "Username must be between 3 and 150 characters."
        ),

    body("email")
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage(
            "Please provide a valid email address."
        ),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8 })
        .withMessage(
            "Password must be at least 8 characters long."
        )
];

/**
 * Display registration form.
 */
const showUserRegistrationForm = (req, res) => {
    res.render("register", {
        title: "Register",
        formData: {
            username: "",
            email: ""
        }
    });
};

/**
 * Process registration form.
 */
const processUserRegistrationForm = async (req, res) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash("error", error.msg);
        });

        return res.render("register", {
            title: "Register",
            formData: {
                username: req.body.username || "",
                email: req.body.email || ""
            }
        });
    }

    const {
        username,
        email,
        password
    } = req.body;

    try {
        // Generate salt.
        const salt = await bcrypt.genSalt(10);

        // Hash the password.
        const passwordHash = await bcrypt.hash(
            password,
            salt
        );

        // Create the user in the database.
        const userId = await createUser(
            username,
            email,
            passwordHash
        );

        if (res.locals.NODE_ENV === "development") {
            console.log(
                "Registered user ID:",
                userId
            );
        }

        req.flash(
            "success",
            "Registration successful! Please log in."
        );

        res.redirect("/login");

    } catch (error) {
        console.error(
            "Error registering user:",
            error
        );

        req.flash(
            "error",
            "An error occurred during registration. Please try again."
        );

        res.redirect("/register");
    }
};

/**
 * Display login form.
 */
const showLoginForm = (req, res) => {
    res.render("login", {
        title: "Login"
    });
};

/**
 * Process login form.
 */
const processLoginForm = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        const user = await authenticateUser(
            email,
            password
        );

        if (user) {

            // Store authenticated user in the session.
            // password_hash has already been removed
            // by authenticateUser().
            req.session.user = user;

            req.flash(
                "success",
                "Login successful!"
            );

            if (res.locals.NODE_ENV === "development") {
                console.log(
                    "User logged in:",
                    user
                );
            }

            // Week 5 Protected Routes requirement.
            res.redirect("/dashboard");

        } else {

            req.flash(
                "error",
                "Invalid email or password."
            );

            res.redirect("/login");
        }

    } catch (error) {

        console.error(
            "Error during login:",
            error
        );

        req.flash(
            "error",
            "An error occurred during login. Please try again."
        );

        res.redirect("/login");
    }
};

/**
 * Process logout.
 */
const processLogout = (req, res) => {
    req.session.destroy((error) => {

        if (error) {
            console.error(
                "Error destroying session:",
                error
            );

            return res.redirect("/");
        }

        res.redirect("/login");
    });
};

/**
 * Protect routes that require authentication.
 */
const requireLogin = (req, res, next) => {

    if (!req.session || !req.session.user) {

        req.flash(
            "error",
            "You must be logged in to access that page."
        );

        return res.redirect("/login");
    }

    next();
};

/**
 * Display protected dashboard.
 */
const showDashboard = (req, res) => {

    const user = req.session.user;

    res.render("dashboard", {
        title: "Dashboard",
        username: user.username,
        email: user.email
    });
};


/**
 * Middleware factory to require a specific user role.
 *
 * @param {string} role - Required role name.
 * @returns {Function} Express middleware function.
 */
const requireRole = (role) => {
    return (req, res, next) => {

        // Check if the user is logged in
        if (!req.session || !req.session.user) {
            req.flash(
                'error',
                'You must be logged in to access this page.'
            );

            return res.redirect('/login');
        }

        // Check the user's role
        if (req.session.user.role_name !== role) {
            req.flash(
                'error',
                'You do not have permission to access this page.'
            );

            return res.redirect('/');
        }

        // User has the correct role
        next();
    };
};

/**
 * Display all registered users.
 *
 * This page is protected by requireRole("admin")
 * in the route.
 */
const showUsersPage = async (req, res) => {
    try {
        const users = await getAllUsers();

        res.render("users", {
            title: "Registered Users",
            users
        });

    } catch (error) {
        console.error(
            "Error loading users:",
            error
        );

        req.flash(
            "error",
            "An error occurred while loading the users."
        );

        res.redirect("/dashboard");
    }
};

export {
    registrationValidation,
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
};
