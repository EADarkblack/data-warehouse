module.exports = (sequelize, {DataTypes}) => {
    return sequelize.define('region', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name:{
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: [1, 50],
                    msg: 'The name must be at least 1 characters long.'
                }
            }
        }
    },{
        freezeTableName: true,
    })
}