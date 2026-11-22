const bcrypt = require("bcrypt");

module.exports = (sq, datatypes) => {
  const User = sq.define(
    "User",
    {
      id: {
        type: datatypes.UUID,
        defaultValue: datatypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: datatypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [4, 20],
            msg: "username length should be between 4 to 20",
          },
        },
      },
      email: {
        type: datatypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "email should be valid",
          },
        },
      },
      password: {
        type: datatypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [4, 20],
            msg: "password length should be between 10 to 50",
          },
        },
      },
      role: {
        type: datatypes.ENUM("event_organizer", "customer"),
        defaultValue: "customer",
      },
    },
    {
      timeStamps: true,
      indexes: [{ fields: ["email"] }],
      tableName: "eb_users",
      defaultScope: { attributes: { exclude: ["password"] } },
      scope: {
        withPassword: {
          attributes: { include: ["password"] },
        },
      },
      hooks: {
        beforeSave: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    },
  );

  User.associate = (models) => {
    User.hasMany(models.Event, {
      foreignKey: "userId",
      as: "events",
      onDelete: "cascade",
    });
    User.hasMany(models.Booking, {
      foreignKey: "userId",
      as: "bookings",
      onDelete: "cascade",
    });
  };

  return User
};
