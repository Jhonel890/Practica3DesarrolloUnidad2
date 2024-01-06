'use strict';


module.exports = (sequelize, DataTypes) => {
    const comprador = sequelize.define('comprador', {
        apellidos: {
            type: DataTypes.STRING(100), defaultValue: "NONE",
        },
        nombres: {
            type: DataTypes.STRING(100), defaultValue: "NONE",
        },
        direccion: {
            type: DataTypes.STRING, defaultValue: "NONE",
        },
        celular: {
            type: DataTypes.STRING(20), defaultValue: "NONE",
        },
        cedula: {
            type: DataTypes.STRING(10), defaultValue: "NONE",
        },
        external_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
    }, { freezeTableName: true });

    comprador.associate = function (models) {
        comprador.belongsTo(models.venta, { foreignKey: 'id_comprador' });
    };

    return comprador;
};
