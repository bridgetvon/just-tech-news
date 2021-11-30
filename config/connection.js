//import the sequwelize constructor from the librqary 
const Sequelize = require('sequelize');

require('dotenv').config();

//create connection  to our database, pass in your sql info 
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;
