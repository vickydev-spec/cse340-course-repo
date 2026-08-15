import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

import {
    createUser,
    authenticateUser,
    getAllUsers
} from "../models/users.js";

import {
    getVolunteerProjects
} from "../models/volunteers.js";


// ============================================================
// REGISTRATION VALIDATION
// ============================================================

const registrationValidation = [

    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required.")
        .isLength({
            min: 3,
            max: 150
        })
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
        .isLength({
            min: 8
        })
        .withMessage(
            "Password must be at least 8 characters long."
        )
];


// ============================================================
// SHOW REGISTRATION FORM
// ============================================================

const showUserRegistrationForm = (req, res) => {

    res.render("register", {
        title: "Register",

        formData: {
            username: "",
            email: ""
        }
    });
};


// ============================================================
// PROCESS REGISTRATION
// ============================================================

const processUserRegistrationForm = async (req, res) => {

    const results = validationResult(req);

    if (!results.isEmpty()) {

        results.array().forEach((error) => {

            req.flash(
                "error",
                error.msg
            );

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

        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(
            password,
            salt
        );


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


// ============================================================
// SHOW LOGIN FORM
// ============================================================

const showLoginForm = (req, res) => {

    res.render("login", {
        title: "Login"
    });

};


// ============================================================
// PROCESS LOGIN
// ============================================================

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


// ============================================================
// LOGOUT
// ============================================================

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


// ============================================================
// REQUIRE LOGIN
// ============================================================

const requireLogin = (req, res, next) => {

    if (
        !req.session ||
        !req.session.user
    ) {

        req.flash(
            "error",
            "You must be logged in to access that page."
        );

        return res.redirect("/login");
    }


    next();
};


// ============================================================
// SHOW DASHBOARD
// ============================================================

const showDashboard = async (req, res, next) => {

    try {

        const user = req.session.user;


        // Get projects this user volunteered for.
        const volunteerProjects =
            await getVolunteerProjects(
                user.user_id
            );


        res.render("dashboard", {

            title: "Dashboard",

            username: user.username,

            email: user.email,

            volunteerProjects

        });


    } catch (error) {

        next(error);

    }
};


// ============================================================
// REQUIRE ROLE
// ============================================================

const requireRole = (role) => {

    return (req, res, next) => {


        if (
            !req.session ||
            !req.session.user
        ) {

            req.flash(
                "error",
                "You must be logged in to access this page."
            );

            return res.redirect("/login");
        }


        if (
            req.session.user.role_name !== role
        ) {

            req.flash(
                "error",
                "You do not have permission to access this page."
            );

            return res.redirect("/");
        }


        next();
    };
};


// ============================================================
// SHOW ALL USERS
// ============================================================

const showUsersPage = async (req, res, next) => {

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


        next(error);

    }
};


// ============================================================
// EXPORTS
// ============================================================

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