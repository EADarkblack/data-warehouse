const router = require('express').Router();
const {PORT, USER, VERSION, PASSWORD, DB_NAME} = process.env;
const {Sequelize} = require('sequelize');
const sequelize = new Sequelize(`mysql://${USER}:${PASSWORD}@localhost:${PORT}/${DB_NAME}`);

// Models

const country = require('./models/country');
const Country = country(sequelize, Sequelize);
const region = require('./models/region');
const Region = region(sequelize, Sequelize);
const city = require('./models/city');
const City = city(sequelize, Sequelize);
Region.hasMany(Country, {foreignKey: 'region_id'});
Country.belongsTo(Region, {foreignKey: 'region_id'});

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
 * Allows to get all countries from the database
 */

router.get(`${VERSION}/country`, validateToken, (req, res) => {
    Country.findAll({
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
 * Allows to create a new country in the database
 */

router.post(`${VERSION}/country/new`, validateToken, (req, res) => {
    const {name, region_uuid} = req.body;
    Region.findOne({where: {uuid: region_uuid},
        attributes: {exclude: ['uuid', 'name', 'createdAt', 'updatedAt']},
    })
    .then((region) => {
        const {id} = region.dataValues; 
        Country.create({
            name,
            region_id: id
        })
        .then((data) => {
            const {uuid} = data.dataValues;
            Country.findOne({where: {uuid: uuid}})
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
 * Allows to get a specific country from the database using its uuid
 */

router.get(`${VERSION}/country/:id`, validateToken, (req, res) => {
    const {id} = req.params;
    Country.findOne({where: {uuid: id},
        attributes: {exclude: ['id']},
    })
    .then((data) => {
        data ? res.json(data) : res.status(404).json({
            error: 'Country not found.',
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
 * Allows to update a specific country from the database using its uuid
 */

router.put(`${VERSION}/country/:id`, validateToken, (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    Country.update({
        name
    }, {where: {uuid: id}})
    .then(() => {
        Country.findOne({where:{uuid: id}})
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
 * Allows to delete a specific country from the database using its uuid
 */

router.delete(`${VERSION}/country/:id`, validateToken, (req, res) => {
    const {id} = req.params;
    Country.findOne({where: {uuid: id}})
    .then((data) => {
        if (data) {
            Country.destroy({where: {uuid: id}})
            .then(() => {
                City.findAll({where: {country_id: null}})
                .then((data) => {
                    data.forEach(({uuid}) => {
                        City.destroy({where: {uuid: uuid}})
                        .then(() => {
                            console.log("Cities deleted successfully");
                        })
                        .catch((err) => {
                            res.status(500).json({
                                error: `A problem has occurred with the server: ${err}.`,
                                status: 500
                            });
                        });
                    })
                })
                .catch((err) => {
                    res.status(500).json({
                        error: `A problem has occurred with the server: ${err}.`,
                        status: 500
                    });
                });
                res.json({
                    message: 'Country deleted successfully.',
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
                error: 'Region not found.',
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