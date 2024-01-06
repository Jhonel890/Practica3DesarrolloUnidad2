'use strict';


module.exports = (sequelize, DataTypes) => {
    const auto = sequelize.define('auto', {
        precio: {
            type: DataTypes.STRING(100), defaultValue: "NONE",
        },
        color: {
            type: DataTypes.STRING(100), defaultValue: "NONE",
        },
        modelo: {
            type: DataTypes.STRING(100), defaultValue: "NONE",
        },
        numSerie: {
            type: DataTypes.STRING(100), defaultValue: "NONE",
        },
        anio: {
            type: DataTypes.STRING(100), defaultValue: "NONE",
        },
        estado: {
            type: DataTypes.ENUM(['VENDIDO', 'SIN_VENDER']), defaultValue: 'SIN_VENDER'
        },
        external_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
    }, { freezeTableName: true });

    auto.associate = function (models) {
        auto.belongsTo(models.persona, { foreignKey: 'id_persona' });
        auto.hasOne(models.venta, { foreignKey: 'id_venta', as: 'venta' });
        auto.hasMany(models.imagen, { foreignKey: 'id_auto', as: 'imagen' });
    };
    return auto;
};
