module.exports = (sequelize, {DataTypes}) => {
    return sequelize.define('user', {
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
        last_name: {
            type: DataTypes.STRING(100),
            validate: {
                len: {
                    args: [1, 100],
                    msg: 'The last name must be at least 1 characters long.'
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
        profile: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len: {
                    args: [8, 200],
                    msg: 'The email must be at least 8 characters long.'
                }
            }
        }
    },{
        freezeTableName: true,
    })
}