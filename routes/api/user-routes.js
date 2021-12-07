const router = require('express').Router();
const { User, Post, Vote } = require('../../models');

//GET /API/USERS
router.get('/', (req, res) => {
    //Access our User model and run . findall() method
    //findAll is equivelent to SELECT * FROM users
    User.findAll({
        //prevent passwords from displaying in the query 
        attributes: {exclude: ['password']}
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//GET API/USERS/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password']},
        where: {
            id: req.params.id
        },
       include: [
           {
               model: Post, 
               attributes: ['id', 'title', 'post_url', 'created_at']
           },
           {
               model: Comment,
               attributes: ['id', 'comment_text', 'created_at'],
               include: {
                   model: Post,
                   attributes: ['title']
               }
           },
           {
            model: Post, 
            attributes: ['title'], 
            through: Vote, 
            as: 'voted_posts'
            }       
          ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with that id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//POST api/ users
router.post('/', (req, res) => {
    //expects {username: 'bschaefer', email: 'bridget@gmail.com', password: 'password}
    //create() is like INSERT INTO users (email, name)
    //VALUES ('lern@gmail, 'bridget')
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
    //expect {email : 'email@gmail.com', password: 'password'}
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email!'});
            return;
        }
        //verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!'});
            return;
        }
        res.json({ user: dbUserData, message: 'you are now logged in!'});
    });
});

//PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    //if req.body has key values to match the model you can use req.body instead
    User.update(req.body, {
        //add hook for bcrypt so beforeUpdate method works
        individualHooks: true,
        //update method combines parameters for crreting and lookoing up data 
        //pass req.body to provide new data we want to use in the update
        //use req.params.id to indicate exactly where we want the new data to be used 
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//DELETE api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;

