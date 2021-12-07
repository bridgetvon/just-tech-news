const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//create and define the post model 
class Post extends Model {
    //static is a built in js method 
    //here we indicate that that the upvote methoid is one based in the post model 
    //and not an instance method like we used in the user model 
    static upvote(body, models) {
        return models.Vote.create({
            user_id: body.user_id, 
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id', 
                    'post_url', 
                    'title', 
                    'created_at',
                    [
                        //use raw my sql aggregate function query to get a
                //count of how my votes a post has 
                //return it under vote count 
                        sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ],
                include: [
                    {
                        model: models.Comment,
                        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                        include: {
                            model: models.User,
                            attributes: ['username']
                        }
                    }
                ]
            });
        });
    }
}

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