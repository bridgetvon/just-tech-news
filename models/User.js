const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

//create our User Model 
class User extends Model {
    //set up method to run on instance date (per user) to check password 
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    } 
}

//define tbale columns and configuration 
User.init(
    {
        //table column definitions go here 
        //define an id column 
        id: {
            type: DataTypes.INTEGER,
            //equivalent of not null 
            allowNull: false,
            //instruct that it is a primary key 
            primaryKey: true,
            //turn on autoincrement
            autoIncrement: true
        },
        //define a username column 
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //DEFINE AN EMAIL COLUMN 
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //do not allow duplicate email values
            unique: true,
            //if allow null is set to false we can run our data through validatores before creating table data
            validate: {
                isEmail: true
            }
        },
        //define a password column 
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //this means the password must be at least four chara cters long 
                len: [4]
            }
        }
    },
    {
        hooks: {
            //set up beforecreate lifecycle hook functionality
           async beforeCreate(newUserData) {
                //pass user object with plaintext password and saltround with a value of ten
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                    return newUserData;
                },
            //set up beforeupdate lifecycle hook 
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
            },
    
        sequelize,
        //table configuration options go here 
        //pass in imported sequelize connection 
        //dont automatically create updated timestamps
        timestamps: false,
        //dont pluralize name of database table 
        freezeTableName: true,
        //use underscpores instead of camel casing 
        underscored: true,
        //make it so our name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;