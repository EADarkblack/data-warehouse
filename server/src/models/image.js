module.exports = (sequelize, { DataTypes }) => {
    return sequelize.define('image', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        type: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        data: {
            type: DataTypes.BLOB("long")
        }
    }, {
        freezeTableName: true,
    })
}