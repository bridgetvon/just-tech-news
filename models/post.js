const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//create and define the post model 
class Post extends Model {}

//create fields/columns for post model 
Post.init(
    {
        //define the post schema 
        id: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            AllowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        user_id: {
            //use references to eastablish relationship between this 
            //post and the user by referencing the user model 
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
    }
);

module.exports = Post;