const {Pool} = require('pg');
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool.connect();

const getFighterID = async (name, tier) => {
  const query = {
    text: 'SELECT * FROM Fighter WHERE name = $1 AND tier = $2',
    values: [name, tier],
  };

  return pool.query(query)
      .catch((err) => {
        throw err;
      });
};

const submitMatch = async (matchData) => {

};

module.exports = {
  getFighterID,
  submitMatch,
};