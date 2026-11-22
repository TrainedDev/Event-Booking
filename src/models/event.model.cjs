module.exports = (sq, datatypes) => {
  const Event = sq.define(
    "Event",
    {
      id: {
        type: datatypes.UUID,
        defaultValue: datatypes.UUIDV4,
        primaryKey: true,
      },

      eventName: {
        type: datatypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [4, 20],
            msg: "event name length should be between 4 to 20",
          },
        },
      },

      description: {
        type: datatypes.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [50, 90],
            msg: "description length should be between 50 to 90",
          },
        },
      },
      location: {
        type: datatypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[0-9a-z\s]+$/,
            msg: "location only contains number space letters",
          },
        },
      },

      totalTickets: {
        type: datatypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [100],
            msg: "ticket should be more than 100",
          },
        },
      },

      ticketPrice: {
        type: datatypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "ticket price should be more than 0",
          },
        },
      },
    },
    {
      timestamps: true,
      tableName: "eb_event",
    },
  );

  Event.associate = (models) => {
    Event.belongsTo(models.User);
    Event.hasMany(models.Booking, {
      foreignKey: "eventId",
      as: "customers",
      onDelete: "cascade",
    });
  };

  return Event;
};
