// config.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost', // your database host
  port: 5432,        // database port
  username: 'root',
  password: 'root',
  database: 'db_siatest',
});

module.exports = sequelize;
