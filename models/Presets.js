module.exports = (sequelize, DataTypes) => {
    const Presets = sequelize.define("Presets", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        calories: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        protein: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        fat: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        addedSugar: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        water: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: false,
            defaultValue: 0,
        }
    });

    Presets.associate = (models) => {
        Presets.belongsTo(models.Users, {
            foreignKey: { allowNull: false },
            onDelete: "CASCADE",
        });
    };

    return Presets;
}