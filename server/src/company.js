// Dependencies

const router = require('express').Router();
const { PORT, USER, VERSION, PASSWORD, DB_NAME } = process.env;
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(`mysql://${USER}:${PASSWORD}@localhost:${PORT}/${DB_NAME}`)

// Models

const company = require('./models/company');
const Company = company(sequelize, Sequelize);
const region = require('./models/region');
const Region = region(sequelize, Sequelize);
const country = require('./models/country');
const Country = country(sequelize, Sequelize);
const city = require('./models/city');
const City = city(sequelize, Sequelize);
Region.hasMany(Company, { foreignKey: 'region_id' });
Company.belongsTo(Region, { foreignKey: 'region_id' });
Country.hasMany(Company, { foreignKey: 'country_id' });
Company.belongsTo(Country, { foreignKey: 'country_id' });
City.hasMany(Company, { foreignKey: 'city_id' });
Company.belongsTo(City, { foreignKey: 'city_id' });

//Sync function to create a new table - DON'T DELETE IT

/* Company.sync({ force: true }).then(() => {
    console.log("Company table created");
}).catch((err) => {
    console.log(err)
}) */

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
 * Get all companies from the database.
 */

router.get(`${VERSION}/company`, validateToken, (req, res) => {
    const limitValue = parseInt(req.rawHeaders[17]);
    const offsetValue = parseInt(req.rawHeaders[7]);
    const sortValue = req.rawHeaders[19];
    const sortColumn = req.rawHeaders[9];
    Company.findAll({
        attributes: { exclude: ['id', 'region_id', 'country_id', 'city_id'] },
        order: [[`${sortColumn}`, `${sortValue}`]],
        limit: limitValue,
        offset: offsetValue,
        include: [{
            model: Region,
            attributes: { exclude: ['id'] }
        }, {
            model: Country,
            attributes: { exclude: ['id', 'region_id'] },
        }, {
            model: City,
            attributes: { exclude: ['id', 'country_id'] }
        }]
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
 * Create a new company.
 */

router.post(`${VERSION}/company/new`, validateToken, (req, res) => {
    const { name, email, phone, address, uuid_region, uuid_country, uuid_city } = req.body;
    Region.findOne({
        where: { uuid: uuid_region },
        attributes: { exclude: ['uuid', 'name', 'createdAt', 'updatedAt'] },
    })
        .then(({ dataValues }) => {
            let region_id = dataValues.id;
            Country.findOne({
                where: { uuid: uuid_country },
                attributes: { exclude: ['uuid', 'name', 'createdAt', 'updatedAt'] },
            })
                .then(({ dataValues }) => {
                    let country_id = dataValues.id;
                    City.findOne({
                        where: { uuid: uuid_city },
                        attributes: { exclude: ['uuid', 'name', 'createdAt', 'updatedAt'] },
                    })
                        .then(({ dataValues }) => {
                            let city_id = dataValues.id;
                            Company.create({
                                name,
                                email,
                                phone,
                                address,
                                region_id: region_id,
                                country_id: country_id,
                                city_id: city_id
                            },)
                                .then(({ dataValues }) => {
                                    Company.findOne({
                                        where: { id: dataValues.id },
                                        attributes: { exclude: ['id', 'region_id', 'country_id', 'city_id'] },
                                        include: [{
                                            model: Region,
                                            attributes: { exclude: ['id'] }
                                        }, {
                                            model: Country,
                                            attributes: { exclude: ['id', 'region_id'] },
                                        }, {
                                            model: City,
                                            attributes: { exclude: ['id', 'country_id'] }
                                        }]
                                    })
                                        .then(({ dataValues }) => {
                                            res.json(dataValues);
                                        }).catch((err) => {
                                            res.status(500).json({
                                                error: `A problem has occurred with the server: ${err}.`,
                                                status: 500
                                            });
                                        })
                                })
                                .catch(() => {
                                    res.status(400).json({
                                        error: `The information received is invalid or necessary information is missing.`,
                                        status: 400
                                    });
                                });
                        }).catch((err) => {
                            res.status(500).json({
                                error: `A problem has occurred with the server: ${err}.`,
                                status: 500
                            });
                        })
                }).catch((err) => {
                    res.status(500).json({
                        error: `A problem has occurred with the server: ${err}.`,
                        status: 500
                    });
                })
        }).catch((err) => {
            res.status(500).json({
                error: `A problem has occurred with the server: ${err}.`,
                status: 500
            });
        })

});

/**
 * Update a company searching it by the uuid
 */

router.put(`${VERSION}/company/:id`, validateToken, (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, uuid_region, uuid_country, uuid_city } = req.body;
    if (uuid_region && uuid_country && uuid_city && address) {
        Region.findOne({
            where: { uuid: uuid_region },
            attributes: { exclude: ['uuid', 'name', 'createdAt', 'updatedAt'] },
        })
            .then(({ dataValues }) => {
                let region_id = dataValues.id;
                Country.findOne({
                    where: { uuid: uuid_country },
                    attributes: { exclude: ['uuid', 'name', 'createdAt', 'updatedAt'] },
                })
                    .then(({ dataValues }) => {
                        let country_id = dataValues.id;
                        City.findOne({
                            where: { uuid: uuid_city },
                            attributes: { exclude: ['uuid', 'name', 'createdAt', 'updatedAt'] },
                        })
                            .then(({ dataValues }) => {
                                let city_id = dataValues.id;
                                Company.update({
                                    name,
                                    email,
                                    phone,
                                    address,
                                    region_id: region_id,
                                    country_id: country_id,
                                    city_id: city_id
                                }, { where: { uuid: id } })
                                    .then(() => {
                                        Company.findOne({ where: { uuid: id } })
                                            .then(({ dataValues }) => {
                                                Company.findOne({
                                                    where: { id: dataValues.id },
                                                    attributes: { exclude: ['id', 'region_id', 'country_id', 'city_id'] },
                                                    include: [{
                                                        model: Region,
                                                        attributes: { exclude: ['id'] }
                                                    }, {
                                                        model: Country,
                                                        attributes: { exclude: ['id', 'region_id'] },
                                                    }, {
                                                        model: City,
                                                        attributes: { exclude: ['id', 'country_id'] }
                                                    }]
                                                })
                                                    .then(({ dataValues }) => {
                                                        res.json(dataValues);
                                                    }).catch((err) => {
                                                        res.status(500).json({
                                                            error: `A problem has occurred with the server: ${err}.`,
                                                            status: 500
                                                        });
                                                    })
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
                            }).catch((err) => {
                                res.status(500).json({
                                    error: `A problem has occurred with the server: ${err}.`,
                                    status: 500
                                });
                            })
                    }).catch((err) => {
                        res.status(500).json({
                            error: `A problem has occurred with the server: ${err}.`,
                            status: 500
                        });
                    })
            }).catch((err) => {
                res.status(500).json({
                    error: `A problem has occurred with the server: ${err}.`,
                    status: 500
                });
            })
    } else {
        Company.update({
            name,
            email,
            phone
        }, { where: { uuid: id } })
            .then(() => {
                Company.findOne({ where: { uuid: id } })
                    .then(({ dataValues }) => {
                        Company.findOne({
                            where: { id: dataValues.id },
                            attributes: { exclude: ['id', 'region_id', 'country_id', 'city_id'] },
                            include: [{
                                model: Region,
                                attributes: { exclude: ['id'] }
                            }, {
                                model: Country,
                                attributes: { exclude: ['id', 'region_id'] },
                            }, {
                                model: City,
                                attributes: { exclude: ['id', 'country_id'] }
                            }]
                        })
                            .then(({ dataValues }) => {
                                res.json(dataValues);
                            }).catch((err) => {
                                res.status(500).json({
                                    error: `A problem has occurred with the server: ${err}.`,
                                    status: 500
                                });
                            })
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
    }
});

/**
 * Delete a company by its uuid
 */

router.delete(`${VERSION}/company/:id`, validateToken, (req, res) => {
    const { id } = req.params;
    Company.findOne({ where: { uuid: id } })
        .then((data) => {
            if (data) {
                Company.destroy({ where: { uuid: id } })
                    .then(() => {
                        res.json({
                            message: 'Company deleted successfully.',
                            status: 200
                        })
                    })
                    .catch((err) => {
                        res.status(500).json({
                            error: `A problem has occurred with the server: ${err}.`,
                            status: 500
                        });
                    });
            } else {
                res.status(404).json({
                    error: 'Company not found.',
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