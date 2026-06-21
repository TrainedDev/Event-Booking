module.exports = (sq, datatypes) => {
  const Bookings = sq.define(
    "event_booking_bookings",
    {
      id: {
        type: datatypes.UUID,
        defaultValue: datatypes.UUIDV4,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      totalTickets: {
        type: datatypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "required field is empty",
          },
          isInt: {
            msg: "totalTickets must be an integer",
          },
        },
      },
      totalPrice: {
        type: datatypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "required field is empty",
          },
          isFloat: {
            msg: "totalPrice must be a float",
          },
        },
      },
    },
    {
      timestamps: true,
    },
  );

  Bookings.associate = (model) => {
    Bookings.belongsTo(model.EVENTS, {
      foreignKey: "eventId",
      as: "event",
      onDelete: "CASCADE",
    });
    Bookings.belongsTo(model.USERS, {
      foreignKey: "userId",
      as: "customer",
      onDelete: "CASCADE",
    });
  };

  return Bookings;
};
