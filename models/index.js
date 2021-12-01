
//set up user model and export an object with it as a property
const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

//create associations 
User.hasMany(Post, {
    foreignKey: 'user_id'
});

//define the relationship of the post model to the user 
//this says the post can belong to one user but not many 
Post.belongsTo(User, {
    foreignKey: 'user_id', 
});

//associate the USer and Post to one another so that 
//when we query Post you can see how many votes a user
//creates. and when we query User we can see posts they voted on 

User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote };














module.exports = {User};
