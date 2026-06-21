module.exports = (sq, datatypes) => {
  const Events = sq.define(
    "event_booking_events",
    {
      id: {
        type: datatypes.UUID,
        defaultValue: datatypes.UUIDV4,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: datatypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "required field is empty",
          },
        },
      },
      description: {
        type: datatypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "required field is empty",
          },
        },
      },
      date: {
        type: datatypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "required field is empty",
          },
          isDate: {
            msg: "invalid date format",
          },
        },
      },
      location: {
        type: datatypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "required field is empty",
          },
        },
      },
      slots: {
        type: datatypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "required field is empty",
          },
          isInt: {
            msg: "slots must be an integer",
          },
          min: {
            args: [1],
            msg: "slots must be at least 1",
          },
        },
      },

      ticketPrice: {
        type: datatypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "required field is empty",
          },
          isFloat: {
            msg: "ticketPrice must be a float",
          },
          min: {
            args: [0],
            msg: "ticketPrice must be at least 0",
          },
        },
      },
    },
    {
      timestamps: true,
      modelName: "Events",
    },
  );

  Events.associate = (model) => {
    Events.belongsTo(model.event_booking_users, {
      foreignKey: "userId",
      as: "event_organizer",
    });
    Events.hasMany(model.event_booking_bookings, {
      foreignKey: "eventId",
      as: "event_bookings",
      onDelete: "CASCADE",
    });
  };

  return Events;
};
