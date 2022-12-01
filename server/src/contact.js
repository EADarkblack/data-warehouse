// Dependencies

const router = require('express').Router();
const { PORT, USER, VERSION, PASSWORD, DB_NAME } = process.env;
const { Sequelize, Op } = require('sequelize');
const sequelize = new Sequelize(`mysql://${USER}:${PASSWORD}@localhost:${PORT}/${DB_NAME}`);
const multer = require('multer');
global.__basedir = __dirname;
const fs = require('fs');

// Models

const contact = require('./models/contact');
const Contact = contact(sequelize, Sequelize);
const company = require('./models/company');
const Company = company(sequelize, Sequelize);
const region = require('./models/region');
const Region = region(sequelize, Sequelize);
const country = require('./models/country');
const Country = country(sequelize, Sequelize);
const city = require('./models/city');
const City = city(sequelize, Sequelize);
const image = require('./models/image');
const Image = image(sequelize, Sequelize);
Company.hasMany(Contact, { foreignKey: 'company_id' });
Contact.belongsTo(Company, { foreignKey: 'company_id' });
Region.hasMany(Contact, { foreignKey: 'region_id' });
Contact.belongsTo(Region, { foreignKey: 'region_id' });
Country.hasMany(Contact, { foreignKey: 'country_id' });
Contact.belongsTo(Country, { foreignKey: 'country_id' });
City.hasMany(Contact, { foreignKey: 'city_id' });
Contact.belongsTo(City, { foreignKey: 'city_id' });
Image.hasOne(Contact, { foreignKey: 'image_id' });
Contact.belongsTo(Image, { foreignKey: 'image_id' });

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

/**
 * This funcion creates a temporary image file in the public/assets folder
 */

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/public/assets/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}.jpg`);
    }
})

/**
 * Function to set the storage configuration
 */

const upload = multer({ storage: storage });

// Routes

/**
 * It allows to get every contact from database with some filters
 */

router.get(`${VERSION}/contact`, validateToken, (req, res) => {
    const { q } = req.query;
    const limitValue = parseInt(req.rawHeaders[17]);
    const offsetValue = parseInt(req.rawHeaders[7]);
    const sortValue = req.rawHeaders[19];
    const sortColumn = req.rawHeaders[9];
    const sortArr = sortColumn.split(".");
    const orderTypeFK = [[`${sortArr[0]}`, `${sortArr[1]}`, `${sortValue}`]];
    const orderNative = [[`${sortArr[0]}`, `${sortValue}`]];
    Contact.findAll({
        where: q && {
            [Op.or]: [
                { name: { [Op.like]: `%${q}%` } },
                { last_name: { [Op.like]: `%${q}%` } },
                { email: { [Op.like]: `%${q}%` } },
                { position: { [Op.like]: `%${q}%` } },
                { interest: { [Op.like]: `%${q}%` } },
                { '$country.name$': { [Op.like]: `%${q}%` } },
                { '$region.name$': { [Op.like]: `%${q}%` } },
                { '$company.name$': { [Op.like]: `%${q}%` } }
            ]
        },
        attributes: { exclude: ['id', 'company_id', 'region_id', 'country_id', 'city_id', 'image_id'] },
        order: sortArr.length > 1 ? orderTypeFK : orderNative,
        limit: limitValue,
        offset: offsetValue,
        include: [
            {
                model: Company,
                attributes: { exclude: ['id', 'region_id', 'country_id', 'city_id'] },
                as: 'company'
            },
            {
                model: Region,
                attributes: { exclude: ['id'] },
                as: 'region'
            },
            {
                model: Country,
                attributes: { exclude: ['id', 'region_id'] },
                as: 'country'
            },
            {
                model: City,
                attributes: { exclude: ['id', 'country_id'] }
            },
            {
                model: Image,
                attributes: { exclude: ['id'] }
            }
        ]
    }).then((data) => {
        res.json(data)
    }).catch((err) => {
        res.status(500).json({
            error: `A problem has occurred with the server: ${err}.`,
            status: 500
        });
    })
});

/**
 * It allows to create a new contact
 */

router.post(`${VERSION}/contact/new`, validateToken, (req, res) => {
    const { name, last_name, position, email, company_uuid, region_uuid, country_uuid, city_uuid, address, channel, image_id, interest } = req.body;
    Company.findOne({
        where: { uuid: company_uuid }
    }).then(({ dataValues }) => {
        const company_id = dataValues.id;
        Region.findOne({
            where: { uuid: region_uuid }
        }).then(({ dataValues }) => {
            const region_id = dataValues.id;
            Country.findOne({
                where: { uuid: country_uuid }
            }).then(({ dataValues }) => {
                const country_id = dataValues.id;
                City.findOne({
                    where: { uuid: city_uuid }
                }).then(({ dataValues }) => {
                    const city_id = dataValues.id;
                    Contact.create({
                        name: name,
                        last_name: last_name,
                        position: position,
                        email: email,
                        company_id: company_id,
                        region_id: region_id,
                        country_id: country_id,
                        city_id: city_id,
                        address: address,
                        channel: channel,
                        image_id: image_id,
                        interest: interest
                    }).then(({ dataValues }) => {
                        res.json(dataValues);
                    }).catch(() => {
                        res.status(400).json({
                            error: `The information received is invalid or necessary information is missing.`,
                            status: 400
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
    });
});

/**
 * It allow to edit a contact by its uuid
 */

router.put(`${VERSION}/contact/:id`, validateToken, (req, res) => {
    const { id } = req.params;
    const { name, last_name, position, email, company_uuid, region_uuid, country_uuid, city_uuid, address, channel, interest, image_id } = req.body;
    Company.findOne({
        where: { uuid: company_uuid },
        attributes: { exclude: ['uuid', 'name', 'email', 'phone', 'address', 'createdAt', 'updatedAt', 'region_id', 'country_id', 'city_id'] }
    }).then(({ dataValues }) => {
        let company_id = dataValues.id;
        Region.findOne({
            where: { uuid: region_uuid },
            attributes: { exclude: ['uuid', 'name', 'createdAt', 'updatedAt'] }
        }).then(({ dataValues }) => {
            let region_id = dataValues.id;
            Country.findOne({
                where: { uuid: country_uuid },
                attributes: { exclude: ['uuid', 'name', 'createdAt', 'updatedAt'] }
            }).then(({ dataValues }) => {
                let country_id = dataValues.id;
                City.findOne({
                    where: { uuid: city_uuid },
                    attributes: { exclude: ['uuid', 'name', 'createdAt', 'updatedAt'] }
                }).then(({ dataValues }) => {
                    let city_id = dataValues.id;
                    Contact.update({
                        name,
                        last_name,
                        position,
                        email,
                        company_id,
                        region_id,
                        country_id,
                        city_id,
                        address,
                        channel,
                        interest,
                        image_id
                    }, { where: { uuid: id } }).then(() => {
                        Contact.findOne({
                            where: { uuid: id },
                            attributes: { exclude: ['id', 'region_id', 'country_id', 'city_id', 'company_id'] },
                            include: [{
                                model: Region,
                                attributes: { exclude: ['id'] }
                            }, {
                                model: Country,
                                attributes: { exclude: ['id', 'region_id'] },
                            }, {
                                model: City,
                                attributes: { exclude: ['id', 'country_id'] }
                            }, {
                                model: Company,
                                attributes: { exclude: ['id', 'region_id', 'country_id', 'city_id'] }
                            }]
                        }).then(({ dataValues }) => {
                            res.json(dataValues);
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
 * It allows to delete a contact by its uuid, if the contact has as profile pic the default image this query won't delete the default image from the database, only the contact will be deleted
 */

router.delete(`${VERSION}/contact/:id`, validateToken, (req, res) => {
    const { id } = req.params;
    Contact.findOne({ where: { uuid: id } }).then(({ dataValues }) => {
        if (dataValues.uuid !== "") {
            let image_id = dataValues.image_id;
            Image.destroy({ where: { [Op.and]: [{ id: image_id }, { uuid: { [Op.ne]: 'a56e815b-1bca-44ec-9b8e-ba77a42f0c49' } }] } }).then((data) => {
                if (data === 1) {
                    Contact.destroy({ where: { uuid: id } }).then(() => {
                        res.json({
                            message: 'Contact deleted successfully.',
                            status: 200
                        })
                    }).catch((err) => {
                        res.status(500).json({
                            error: `A problem has occurred with the server: ${err}.`,
                            status: 500
                        });
                    })
                } else {
                    if (image_id === 28) {
                        Contact.destroy({ where: { uuid: id } }).then(() => {
                            res.json({
                                message: 'Contact deleted successfully.',
                                status: 200
                            })
                        }).catch((err) => {
                            res.status(500).json({
                                error: `A problem has occurred with the server: ${err}`,
                                status: 500
                            });
                        })
                    } else {
                        res.status(500).json({
                            error: `A problem has occurred with the server.`,
                            status: 500
                        });
                    }
                }
            }).catch((err) => {
                res.status(500).json({
                    error: `A problem has occurred with the server: ${err}.`,
                    status: 500
                });
            })
        } else {
            res.status(404).json({
                error: 'Contact not found.',
                status: 404
            });
        }
    }).catch((err) => {
        res.status(500).json({
            error: `A problem has occurred with the server: ${err}.`,
            status: 500
        });
    })
});

/**
 * It allows to upload the image data to the database and return the its id to be set to its respective contact
 */

router.post(`${VERSION}/contact/image/new`, validateToken, upload.single("image"), (req, res) => {
    Image.create({
        type: req.file.mimetype,
        name: req.file.originalname,
        data: fs.readFileSync(
            __basedir + "/public/assets/" + req.file.filename
        )
    }).then((data) => {
        res.json({
            id: data.id
        })
    }).catch(() => {
        res.status(400).json({
            error: `The information received is invalid or necessary information is missing.`,
            status: 400
        });
    })
});

/**
 * It allows to update the image's information in the database
 */

router.put(`${VERSION}/contact/image/:id`, validateToken, upload.single("image"), (req, res) => {
    const { id } = req.params;
    Image.update({
        type: req.file.mimetype,
        name: req.file.originalname,
        data: fs.readFileSync(
            __basedir + "/public/assets/" + req.file.filename
        )
    }, { where: { uuid: id } })
        .then(() => {
            res.json({
                message: 'Image updated successfully.',
                status: 200
            })
        }).catch((err) => {
            res.status(500).json({
                error: `A problem has occurred with the server: ${err}.`,
                status: 500
            });
        })
})

// export

module.exports = router;