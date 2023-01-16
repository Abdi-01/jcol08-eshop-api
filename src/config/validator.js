const { check, validationResult } = require('express-validator');

module.exports = {
    checkUser: async (req, res, next) => {
        try {
            // Validation proses
            console.log(req.path)
            if (req.path == '/regis') {
                await check("username").notEmpty().isAlphanumeric().run(req);
            }
            await check("email").notEmpty().isEmail().run(req);
            await check("password").notEmpty().isStrongPassword({
                minLength: 5,
                minLowercase: 1,
                minUppercase: 1,
                minSymbols: 1,
                minNumbers: 1
            }).run(req);

            const validation = validationResult(req);
            console.log(validation);

            if (validation.isEmpty()) {
                // Melanjutkan ke middleware/controller selanjutnya
                next();
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Validation invalid ❌',
                    error: validation.errors
                })
            }

        } catch (error) {
            return res.status(500).send(error);
        }
    }
}