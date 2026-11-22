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
            args: [20, 1000],
            msg: "description length should be between 20 to 1000",
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
            args: [1],
            msg: "ticket should be more than 1",
          },
        },
      },

      ticketPrice: {
        type: datatypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
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
    Event.belongsTo(models.User, {
      foreignKey: "userId",
    });
    Event.hasMany(models.Booking, {
      foreignKey: "eventId",
      as: "customers",
      onDelete: "cascade",
    });
  };

  return Event;
};
