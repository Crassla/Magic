const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Normy = require('../models/normys');
const auth = require('../middleware/auth');
const Card = require('../models/cards');

router.get('/', (req, res) => {
    res.render('../views/normy/login');
});

//when the user logs in it authenticats them then renders the homepage for the teachers
router.get('/:token/:name', auth, async (req, res) => {
    //adds all of the needed databases and varibales
    const people = await Normy.find({}).sort({username:1});
    const token = req.params.token;
    const name = req.params.name;

    //adds token and name to the header
    res.header('token', token);
    res.header('name', name);

    try {
        //trys to render the page
        res.render('normy/index', {
            username: name,
            people: people,
        });
    } catch (e) {
        //if there is an error it logs the error and redirects to the login with an error message
        console.log(e)
        res.render('normy/login', { errorMessage: "Error in Fetching user" });
    };
});

router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //checks if all the nessesary fields have been entered
    try {
        let user = await Normy.findOne({
            username
        });

        if (!user)
            return res.render('normy/login', {
                errorMessage: 'Error: User Does Not Exist',

            });

        //check if the encrypted password matches the users password if it doesn't returns an error
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.render('normy/login', {
                errorMessage: 'Error: Incorrect Password!'
            });

        const payload = {
            user: {
                id: user.id
            }
        };
        //creates a random token for a random string and then redirects it with the token
        jwt.sign(
            payload,
            'randomString',
            {
                expiresIn: 100
            },
            (err, token) => {
                if (err) throw err;
                var url = token + '/' + username.toLowerCase();
                res.redirect(url);

            }
        );
    } catch (e) {
        //if there is an error it logs the error and redirects to the home page
        console.error(e);
        res.redirect('/', {
            errorMessage: 'Error: Server Error'
        });
    };
});

router.post('/trade/:name', async (req, res) => {
    const person_from = req.params.name;
    const person_to = req.body.person_to;
    const name = req.body.name;
    const worth = req.body.worth;
    const people = await Normy.find({}).sort({username:1});

    try {
        const new_card = new Card({
            name,
            worth,
            person_to,
            person_from,
        });

        await new_card.save();

        res.render('normy/index', {
            successMessage: 'Card Successfully Added',
            username: person_from,
            people: people,
        });

    } catch (err) {
        //if there is an error it logs the error and redirects to the home page
        console.error(err);
        res.redirect('/', {
            errorMessage: 'Error: Saving Card',
        });
    }
});

module.exports = router;