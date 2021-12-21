module.exports = (sequelize, {DataTypes}) => {
    return sequelize.define('city', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name:{
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: [1, 100],
                    msg: 'The name must be at least 1 characters long.'
                }
            }
        }
    },{
        freezeTableName: true,
    })
}