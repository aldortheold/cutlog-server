module.exports = (sequelize, DataTypes) => {
    const Targets = sequelize.define("Targets", {
        calories: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        protein: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fat: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        addedSugar: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        water: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    Targets.associate = (models) => {
        Targets.belongsTo(models.Users, {
            foreignKey: { allowNull: false },
            onDelete: "CASCADE",
        });
    };

    return Targets;
};