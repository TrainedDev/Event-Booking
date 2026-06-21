const bcrypt = require("bcrypt");

module.exports = (sq, datatypes) => {
  const Users = sq.define(
    "event_booking_users",
    {
      id: {
        type: datatypes.UUID,
        defaultValue: datatypes.UUIDV4,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: datatypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "required field is empty",
          },
        },
        email: {
          type: datatypes.STRING,
          allowNull: false,
          validate: {
            isEmail: {
              msg: "incorrect email",
            },
          },
        },
        password: {
          type: datatypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "required password not found",
            },
          },
        },
        role: {
          type: datatypes.ENUM("customer", "event_organizer"),
          allowNull: false,
          defaultValue: "customer",
        },
      },
    },
    {
      timestamps: true,

      indexes: [
        {
          fields: ["email"],
        },
      ],

      scope: {
        defaultScope: {
          attributes: { exclude: ["password"] },
        },
      },

      hooks: {
        beforeCreate(user, options) {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
        },

        beforeSave(user, options) {
          if (user.changed("password")) {
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
      },
    },
  );

  Users.associate = (model) => {
    Users.hasMany(model.EVENTS, {
      foreignKey: "userId",
      as: "event_organizer",
      onDelete: "CASCADE",
    });
    Users.hasMany(model.BOOKINGS, {
      foreignKey: "userId",
      as: "customer_bookings",
      onDelete: "CASCADE",
    });
  };

  return Users;
};
