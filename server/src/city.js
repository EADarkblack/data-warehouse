const router = require('express').Router();
const {PORT, USER, VERSION, PASSWORD, DB_NAME} = process.env;
const {Sequelize} = require('sequelize');
const sequelize = new Sequelize(`mysql://${USER}:${PASSWORD}@localhost:${PORT}/${DB_NAME}`);

// Models

const city = require('./models/city');
const City = city(sequelize, Sequelize);
const country = require('./models/country');
const Country = country(sequelize, Sequelize);
Country.hasMany(City, {foreignKey: 'country_id'});
City.belongsTo(Country, {foreignKey: 'country_id'});

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
    });;
}

// Routes

/**
 * Gets all cities from the database
 */

router.get(`${VERSION}/city`, validateToken, (req, res) => {
    City.findAll({
        attributes: {exclude: ['id']},
    })
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.status(500).json({
            error: `A problem has occurred with the server: ${err}.`,
            status: 500
        });
    });
});

/**
 * Allows to create a new city in the database
 */

router.post(`${VERSION}/city/new`, validateToken, (req, res) => {
    const {name, country_uuid} = req.body;
    Country.findOne({where: {uuid: country_uuid},
        attributes: {exclude: ['uuid', 'name', 'createdAt', 'updatedAt']},
    })
    .then((region) => {
        const {id} = region.dataValues; 
        City.create({
            name,
            country_id: id
        })
        .then((data) => {
            const {uuid} = data.dataValues;
            City.findOne({where: {uuid: uuid}})
            .then((data) => {
                const {uuid, name, createdAt, updatedAt} = data.dataValues;
                res.json({
                    uuid,
                    name,
                    createdAt,
                    updatedAt,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    error: `A problem has occurred with the server: ${err}.`,
                    status: 500
                });
            });
        })
        .catch(() => {
            res.status(400).json({
                error: 'The information received is invalid or necessary information is missing.',
                status: 400
            })
        });
    })    
});

/**
 * Allows get an specific city from the database using its uuid
 */

router.get(`${VERSION}/city/:id`, validateToken, (req, res) => {
    const {id} = req.params;
    City.findOne({where: {uuid: id},
        attributes: {exclude: ['id']},
    })
    .then((data) => {
        data ? res.json(data) : res.status(404).json({
            error: 'Region not found.',
            status: 404
        });
    })
    .catch((err) => {
        res.status(500).json({
            error: `A problem has occurred with the server: ${err}.`,
            status: 500
        });
    })
});

/**
 * Allows to update an specific city in the database
 */

router.put(`${VERSION}/city/:id`, validateToken, (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    City.update({
        name
    }, {where: {uuid: id}})
    .then(() => {
        City.findOne({where:{uuid: id}})
        .then((data) => {
            const {uuid, name, createdAt, updatedAt} = data.dataValues;
            res.json({
                uuid,
                name,
                createdAt, 
                updatedAt
            });
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
 * Allows to delete an specific city from the database
 */

router.delete(`${VERSION}/city/:id`, validateToken, (req, res) => {
    const {id} = req.params;
    City.findOne({where: {uuid: id}})
    .then((data) => {
        if (data) {
            City.destroy({where: {uuid: id}})
            .then(() => {
                res.json({
                    message: 'City deleted successfully.',
                    status: 200
                });
            })
            .catch((err) => {
                res.status(500).json({
                    error: `A problem has occurred with the server: ${err}.`,
                    status: 500
                });
            });
        } else {
            res.status(404).json({
                error: 'City not found.',
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