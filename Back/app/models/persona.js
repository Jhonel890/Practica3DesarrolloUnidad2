'use strict';


module.exports = (sequelize, DataTypes) => {
    const persona = sequelize.define('persona', {
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
        external_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
    }, { freezeTableName: true });

    persona.associate = function (models) {
        persona.hasOne(models.cuenta, { foreignKey: 'id_persona', as: 'cuenta' });
        persona.belongsTo(models.rol, { foreignKey: 'id_rol' });
        persona.belongsTo(models.venta, { foreignKey: 'id_venta' });
        persona.hasMany(models.auto, { foreignKey: 'id_persona', as: 'auto' });
    }

    return persona;
};
