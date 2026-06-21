require("dotenv").config();

module.exports = {
  development: {
    use_env_variable: "DB_CONFIG",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DB_CONFIG",
    dialect: "postgres",
  },
};