

const { Pool } = require("pg");

require("dotenv").config()

module.exports = new Pool({
    connectionString: process.env.VITE_DB
  });