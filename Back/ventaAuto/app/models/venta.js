'use strict';


module.exports = (sequelize, DataTypes) => {
    const venta = sequelize.define('venta', {
        total: {
            type: DataTypes.STRING(100), defaultValue: "NONE",
        },
        recargo: {
            type: DataTypes.BOOLEAN, defaultValue: true,
        },
        fecha: {
            type: DataTypes.DATEONLY,
        },
        external_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
    }, { freezeTableName: true });
    venta.associate = function (models) {
        venta.hasMany(models.persona, { foreignKey: 'id_venta', as: 'persona' });
        venta.belongsTo(models.auto, { foreignKey: 'id_auto' });
        venta.belongsTo(models.persona, { foreignKey: 'id_persona' });
        venta.hasOne(models.comprador, { foreignKey: 'id_venta', as: 'comprador' });
    };

    return venta;
};
