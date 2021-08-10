const config = require('../utils/config');
const { Client } = require('pg');

let types = require('pg').types;
types.setTypeParser(1114, (stringValue) => {
  return new Date(Date.parse(stringValue + '+0000'));
});

const client = new Client(config.PSQL_CONFIG);
client.connect();

const query = async (query, values, whatToReturn = 'rows') => {
  const response = await client.query(query, values);
  return whatToReturn === 'firstElement' ? response.rows[0] : response.rows;
};

module.exports = { client, query };
