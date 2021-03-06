//import the sequwelize constructor from the librqary 
const Sequelize = require('sequelize');

require('dotenv').config();

//create connection  to our database, pass in your sql info 
let sequelize;

if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: 'localhost', 
        dialect: 'mysql',
        port: 3306
    });
}

module.exports = sequelize;
