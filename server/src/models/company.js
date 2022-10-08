module.exports = (sequelize, { DataTypes }) => {
    return sequelize.define('company', {
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
                    msg: 'The name must be at least 1 characters long.'
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
                    msg: 'The email must be at least 6 characters long.'
                },
                isEmail: {
                    args: true,
                    msg: 'A valid email address is required.'
                }
            }
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: {
                    args: [5, 50],
                    msg: 'The number phone must be at least 5 characters long.'
                }
            }
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len: {
                    args: [1, 255],
                    msg: 'The address must be at least 1 characters long.'
                }
            }
        }
    }, {
        freezeTableName: true,
    })
}