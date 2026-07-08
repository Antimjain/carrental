const { Pool } = require('pg');

// One shared pool for the whole app. Hosts like Render require SSL, so turn it
// on unless we are talking to a local database.
const connectionString = process.env.DATABASE_URL;
const isLocal = !connectionString || connectionString.includes('localhost');

const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

module.exports = pool;
