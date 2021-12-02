// Dependencies

const router = require('express').Router();
const {PORT, USER, VERSION, PASSWORD, DB_NAME, KEY} = process.env;
const {Sequelize, Op} = require('sequelize');
const sequelize = new Sequelize(`mysql://${USER}:${PASSWORD}@localhost:${PORT}/${DB_NAME}`)
const jwt = require('jsonwebtoken');
const sha1 = require('sha1');
const rateLimit = require('express-rate-limit');

// Models

const user = require('./models/user');
const User = user(sequelize, Sequelize);

// Middlewares

/**
 * 
 * @param {[rawHeaders]} req - Gets the token from the request's header.
 * @param {function} res - Sends to the user the response depending if the user has passed the token on the header request.
 * @param {function} next - When the user has passed a valid token on the request header proceeds to the next function.
 */

 function validateToken(req, res, next) {
    const decodeToken = req.headers.authorization;
    const token = decodeToken.split(' ')[1];
    token ? next() : res.status(401).json({
        error: 'Invalid token',
        status: 401
    });
}

/**
 * 
 * @param {{rawHeaders}} req - Gets the token from the request's header.
 * @param {function} res - Sends to the user the response depending if the user has admin permission.
 * @param {function} next - When the user has admin permissions proceeds to the next function.
 */

function validateRole(req, res, next) {
    const decodeToken = req.headers.authorization;
    const token = decodeToken.split(' ')[1];
    const decoded = jwt.verify(token, KEY);
    const {profile} = decoded;
    profile == true ? next() : res.status(403).json({
        error: 'Administrator permissions are required to perform this action.',
        status: 403
    });
}

/**
 * 
 * @param {{body, rawHeaders}} req - Gets from the request the token, the email and password to proceeds to make the validation.
 * @param {function} res - Sends to the user the response depending if the user use his/her own token and if he/she exists on the database.
 * @param {function} next - When the user exists on the database and he/she is using his/her own  token proceeds to the next function.
 */

function validateLogin(req, res, next) {
    const {email, password} = req.body;
    if(email && password) {
        const encriptedPass = sha1(password);
        User.findOne({where: {email: email, password: encriptedPass},
            attributes: ['uuid', 'profile']
        })
        .then((data) => {
            if(data) {
                const {uuid, profile} = data;
                const tokenData = {
                    uuid,
                    profile
                };
                const token = jwt.sign(tokenData, KEY);
                req.token = token;
                next();
            } else {
                res.status(404).json({
                    error: 'Incorrect email and / or password.',
                    status: 404
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: `A problem has occurred with the server: ${err}.`,
                status: 500
            });
        });
    } else {
        res.status(400).json({
            error: 'The information received is invalid or necessary information is missing.',
            status: 400
        });
    }
}

/**
 * 
 * @param {{params, rawHeaders}} req - Gets from the request the token and the id to proceeds to make the validation and verify if the user's id exists on the database and compare the id from the token with the id received from the params to avoids the data manipulation from a non admin user.
 * @param {function} res - Sends to the user the response depending if the user has admin permission and if the user is trying to modify other users without admin permissions.
 * @param {function} next - When the user has admin permissions proceeds to the next function the same action happen when the non admin user modify his/her own data.
 */

function validateIdRole(req, res, next) {
    const {id} = req.params;
    const decodeToken = req.headers.authorization;
    const token = decodeToken.split(' ')[1];
    const decoded = jwt.verify(token, KEY);
    const {profile} = decoded;
    if (profile == true) {
        next();
    } else {
        id == decoded.uuid ? next() : res.status(401).json({
            error: 'Invalid token',
            status: 401
        });
    }
}

/**
 * When the user makes 5 simultaneous login the server return an error advice to the user that must wait for one minute.
 */

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: "You've exceeded your limit of simultaneous logins, please try again in a minute."
});

// Routes

/**
 * Gets all user from the database (only admin can see this information)
 */

router.get(`${VERSION}/user`, validateToken, validateRole, (req, res) => {
    const sortValue = req.rawHeaders[15];
    const sortColumn = req.rawHeaders[9];
    User.findAll({
        attributes: {exclude: ['id', 'password']},
        order: [[`${sortColumn}`, `${sortValue}`]]
    })
    .then((data) => {
        res.json(data)
    })
    .catch((err) => {
        res.status(500).json({
            error: `A problem has occurred with the server: ${err}.`,
            status: 500
        });
    });
});

/**
 * Allows register a new user on the app (Only an admin can perform this action.)
 */

router.post(`${VERSION}/user/register`, validateToken, validateRole, (req, res) => {
    const {name, last_name, email, profile, password} = req.body;
    const encriptedPass = sha1(password);
    User.create({
        name: name, 
        last_name, 
        email, 
        profile, 
        password: encriptedPass
    })
    .then(({uuid, name, last_name, email, profile, createdAt, updatedAt}) => {
        res.json({
            uuid,
            name,
            last_name: last_name || null,
            email,
            profile,
            createdAt,
            updatedAt
        });
    })
    .catch(() => {
        res.status(400).json({
            error: `The information received is invalid or necessary information is missing.` ,
            status: 400
        });
    });
});

/**
 * Allows to the user log on the app.
 */

router.post(`${VERSION}/user/login`, validateLogin, loginLimiter, (req, res) => {
    const token = req.token;
    const {email} = req.body;
    User.findOne({where: {email: email},
        attributes: {exclude: ['id', 'password']}
    })
    .then((data) => {
        res.json({
            token,
            data
        });
    })
    .catch((err) => {
        res.status(500).json({
            error: `A problem has occurred with the server: ${err}.`,
            status: 500
        });
    });
});

/**
 * Allows get an specific user from the database using him/her id. (Only an admin can perform this action.)
 */

router.get(`${VERSION}/user/:id`, validateToken, validateIdRole, (req, res) => {
    const {id} = req.params;
    User.findOne({where: {uuid: id},
        attributes: {exclude: ['id', 'password']}
    })
    .then((data) => {
        data ? res.json(data) : res.status(404).json({
            error: 'User not found.',
            status: 404
        });  
    })
    .catch((err) => {
        res.status(500).json({
            error: `A problem has occurred with the server: ${err}.`,
            status: 500
        });
    });
});

/**
 * Allows modify the data from an user by his/her uuid.
 */

router.put(`${VERSION}/user/:id`, validateToken, validateIdRole, (req, res) => {
    const {id} = req.params;
    const {name, last_name, email, profile, password} = req.body;
    const encriptedNewPass = password && sha1(password);
    User.update({
        name,
        last_name,
        email,
        profile,
        password : encriptedNewPass,
    }, {where: {uuid: id}})
    .then(() => {
        User.findOne({where:{uuid: id}})
        .then((data) => {
            if (data) {
                const {uuid, name, last_name, email, profile, createdAt, updatedAt} = data.dataValues;
                res.json({
                    uuid, 
                    name, 
                    last_name: last_name || null, 
                    email, 
                    profile, 
                    createdAt, 
                    updatedAt
                });
            } else {
                res.status(404).json({
                    error: 'User not found.',
                    status: 404
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: `A problem has occurred with the server: ${err}.`,
                status: 500
            });
        });
    })
    .catch((err) => {
        res.status(500).json({
            error: `A problem has occurred with the server: ${err}.`,
            status: 500
        });
    });
});

/**
 * Allows delete any user on the database, for this path any role can perform this action, although only admin user can delete others users from the database using his/her respective id.
 */

router.delete(`${VERSION}/user/:id`, validateToken, validateIdRole, (req, res) => {
    const {id} = req.params;
    User.findOne({where: {uuid: id}})
    .then((data) => {
        if (data) {
            User.destroy({where: {[Op.and]: [{uuid: id}, {uuid: {[Op.ne]: '14909911-ba4c-4df4-9fb1-76fa72a670e4'}}]}})
            .then(() => {
                res.json({
                    message: 'User deleted successfully.',
                    status: 200
                })
            })
            .catch(() => {
                res.status(500).json({
                    error: `A problem has occurred with the server: ${err}.`,
                    status: 500
                });
            });
        } else {
            res.status(404).json({
                error: 'User not found.',
                status: 404
            });
        }
    })
    .catch((err) => {
        res.status(500).json({
            error: `A problem has occurred with the server: ${err}.`,
            status: 500
        });
    });
});

// export

module.exports = router;