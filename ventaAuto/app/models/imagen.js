'use strict';

module.exports = (sequelize, DataTypes) => {
    const imagen = sequelize.define('imagen', {
        archivo: {
            type: DataTypes.STRING(200), defaultValue: "NONE",
        },
        external_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
    }, { freezeTableName: true });

    imagen.associate = function (models) {
        imagen.belongsTo(models.auto, { foreignKey: 'id_imagen' });
    };

    return imagen;
};
