/**
 * An array of routes that are accessible to the public. 
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
    "/auth/new-verification",
];

/**
 * An array of routes that are required for authentication. 
 * These routes do not require authentication.
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
];

/**
 * The prefix for API authenitcation routes
 * Use for API Auth
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default path to redirect user to upon login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/chat";