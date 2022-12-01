module.exports = (sequelize, { DataTypes }) => {
    return sequelize.define('contact', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: {
                    args: [1, 100],
                    msg: 'The name must contain at least 1 character.'
                }
            }
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: {
                    args: [1, 100],
                    msg: 'The last name must contain at least 1 character.'
                }
            }
        },
        position: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: {
                    args: [1, 100],
                    msg: 'The position must contain at least 1 character.'
                }
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: [6, 100],
                    msg: 'The email must contain at least 6 characters.'
                },
                isEmail: {
                    args: true,
                    msg: 'A valid email address is required.'
                }
            }
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len: {
                    args: [6, 100],
                    msg: 'The address must contain at least 6 characters.'
                }
            }
        },
        interest: {
            type: DataTypes.INTEGER(3),
            allowNull: false,
            defaultValue: 0,
            validate: {
                isInt: true
            }
        },
        channel: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }, {
        freezeTableName: true,
    })
}