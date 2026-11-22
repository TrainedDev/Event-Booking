module.exports = (sq, datatypes) => {
  const Booking = sq.define(
    "Booking",
    {
      id: {
        type: datatypes.UUID,
        defaultValue: datatypes.UUIDV4,
        primaryKey: true,
      },

      totalBoughtTickets: {
        type: datatypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "ticket quantity should be at least 1",
          },
        },
      },
      totalBoughtTicketPrice: {
        type: datatypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "ticket should be more than 0",
          },
        },
      },
    },
    {
      timestamps: true,
      tableName: "eb_bookings",
    },
  );

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Booking.belongsTo(models.Event, {
      foreignKey: "eventId",
      as: "userBookedEvents",
    });
  };

  return Booking;
};
