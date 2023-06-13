const Pool = require("pg").Pool

const pool = new Pool({
  user: "postgres",
  password: "superpost",
  host: "localhost",
  port: 5432,
  database: "userauth"
});


module.exports = pool;