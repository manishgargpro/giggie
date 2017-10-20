module.exports = {
  development: {
    username: process.env.PROJECT_DB_USERNAME,
    password: process.env.PROJECT_DB_PASSWORD,
    database: "project2db",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  test: {
    username: process.env.PROJECT_DB_USERNAME,
    password: process.env.PROJECT_DB_PASSWORD,
    database: "project2db",
    host: "localhost",
    dialect: "mysql"
  },
  production: {
    use_env_variable: "JAWSDB_URL",
    dialect: "mysql"
  }
}
