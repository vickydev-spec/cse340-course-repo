/**
 * Flash Message Middleware
 *
 * Provides temporary message storage that survives redirects
 * but is consumed when the next page is rendered.
 *
 * Supported message types:
 * success, error, warning, info
 */


/**
 * Initialize flash message storage
 * and provide the req.flash() function.
 */
const flashMiddleware = (req, res, next) => {

    // Make sure flash storage exists.
    if (!req.session.flash) {
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };
    }


    /**
     * req.flash()
     *
     * SET:
     * req.flash("success", "Message")
     *
     * GET ONE TYPE:
     * req.flash("success")
     *
     * GET ALL:
     * req.flash()
     */
    req.flash = function (type, message) {

        // ==========================================
        // SET MESSAGE
        // ==========================================

        if (type && message) {

            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }

            req.session.flash[type].push(message);

            return;
        }


        // ==========================================
        // GET ONE MESSAGE TYPE
        // ==========================================

        if (type && !message) {

            const messages =
                req.session.flash[type] || [];

            // Clear the messages after retrieving them.
            req.session.flash[type] = [];

            return messages;
        }


        // ==========================================
        // GET ALL MESSAGES
        // ==========================================

        const messages = {
            success: req.session.flash.success || [],
            error: req.session.flash.error || [],
            warning: req.session.flash.warning || [],
            info: req.session.flash.info || []
        };


        // Clear all messages after retrieving them.
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };


        return messages;
    };


    next();
};


/**
 * Make flash messages available to EJS templates.
 *
 * IMPORTANT:
 * Calling req.flash() here consumes the messages.
 * Therefore they will only appear once.
 */
const flashLocals = (req, res, next) => {

    res.locals.flash = req.flash;

    // Consume the messages for this page.
    res.locals.messages = req.flash();

    next();
};


/**
 * Combined flash middleware.
 */
const flash = (req, res, next) => {

    flashMiddleware(
        req,
        res,
        () => {
            flashLocals(
                req,
                res,
                next
            );
        }
    );

};


export default flash;