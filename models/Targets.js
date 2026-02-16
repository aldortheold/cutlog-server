module.exports = (sequelize, DataTypes) => {
    const Targets = sequelize.define("Targets", {
        calories: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2250
        },
        protein: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 130
        },
        fat: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100
        },
        addedSugar: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        water: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2
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