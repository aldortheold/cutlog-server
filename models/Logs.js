module.exports = (sequelize, DataTypes) => {
    const Logs = sequelize.define("Logs", {
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
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    });

    return Logs;
}