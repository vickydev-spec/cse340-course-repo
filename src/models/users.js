import bcrypt from "bcrypt";
import db from "./db.js";

/**
 * Create a new user.
 *
 * The password is hashed before it is stored
 * in the database.
 */
const createUser = async (username, email, passwordHash) => {
    const defaultRole = "user";

    const query = `
        INSERT INTO public.users
            (username, email, password_hash, role_id)
        VALUES (
            $1,
            $2,
            $3,
            (
                SELECT role_id
                FROM public.roles
                WHERE role_name = $4
            )
        )
        RETURNING user_id;
    `;

    const queryParams = [
        username,
        email,
        passwordHash,
        defaultRole
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error("Failed to create user.");
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
        console.log(
            "Created new user with ID:",
            result.rows[0].user_id
        );
    }

    return result.rows[0].user_id;
};


/**
 * Find a user by email.
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT
            u.user_id,
            u.username,
            u.email,
            u.password_hash,
            r.role_name
        FROM public.users u
        JOIN public.roles r
            ON u.role_id = r.role_id
        WHERE u.email = $1;
    `;

    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};


/**
 * Get all registered users.
 *
 * This function returns the username, email,
 * and role for every registered user.
 */
const getAllUsers = async () => {
    const query = `
        SELECT
            u.user_id,
            u.username,
            u.email,
            r.role_name
        FROM public.users u
        JOIN public.roles r
            ON u.role_id = r.role_id
        ORDER BY u.username ASC;
    `;

    const result = await db.query(query);

    return result.rows;
};


/**
 * Compare a plain-text password
 * with the stored password hash.
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};


/**
 * Authenticate a user.
 *
 * Returns the user information if the
 * email and password are correct.
 *
 * Returns null if authentication fails.
 */
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordIsValid = await verifyPassword(
        password,
        user.password_hash
    );

    if (!passwordIsValid) {
        return null;
    }

    // Never store the password hash in the session.
    delete user.password_hash;

    return user;
};


export {
    createUser,
    authenticateUser,
    getAllUsers
};