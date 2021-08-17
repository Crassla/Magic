const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Admin = require('../models/admins');
const Normy = require('../models/normys');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
    res.render('../views/admin/login');
});

//when the user logs in it authenticats them then renders the homepage for the teachers
router.get('/:token/:name', auth, async (req, res) => {
    //adds all of the needed databases and varibales
    const token = req.params.token;
    const name = req.params.name;

    //adds token and name to the header
    res.header('token', token);
    res.header('name', name);

    try {
        //trys to render the page
        res.render('admin/index', {
            username: name
        });
    } catch (e) {
        //if there is an error it logs the error and redirects to the login with an error message
        console.log(e)
        res.render('admin/login', { errorMessage: "Error in Fetching user" });
    };
});

router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //checks if all the nessesary fields have been entered
    try {
        let user = await Admin.findOne({
            username
        });

        if (!user)
            return res.render('admin/login', {
                errorMessage: 'Error: User Does Not Exist',

            });

        //check if the encrypted password matches the users password if it doesn't returns an error
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.render('admin/login', {
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

router.post('/add_admin/:name', async (req, res) => {
    const name = req.params.name.toLowerCase();

    const username = req.body.username;
    const password = req.body.password;

    try {
        let admin = await Admin.findOne({
            username
        });

        if (admin) return res.render('admin/index', {
            errorMessage: 'Error: Name Exists',
            username: username
        });

        //generates a new user to save
        admin = new Admin({
            username,
            password,
        });

        //encrypts the password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);
        //saves the new user to the database
        await admin.save();

        const payload = {
            admin: {
                id: admin.id
            }
        };

        //adds a success message if succesfull
        res.render('admin/index', {
            successMessage: 'Signup Successful',
            username: name
        })

    } catch (err) {
        console.log(err.message);
        res.render('admin/index', {
            errorMessage: 'Error in Saving',
            username: name
        });
    }
});

router.post('/add_normy/:name', async (req, res) => {
    const name = req.params.name.toLowerCase();

    const username = req.body.username;
    const password = req.body.password;

    try {
        let normy = await Normy.findOne({
            username
        });

        if (normy) return res.render('admin/index', {
            errorMessage: 'Error: Name Exists',
            username: username
        });

        //generates a new user to save
        normy = new Normy({
            username,
            password,
        });

        //encrypts the password
        const salt = await bcrypt.genSalt(10);
        normy.password = await bcrypt.hash(password, salt);
        //saves the new user to the database
        await normy.save();

        const payload = {
            normy: {
                id: normy.id
            }
        };

        //adds a success message if succesfull
        res.render('admin/index', {
            successMessage: 'Signup Successful',
            username: name
        })

    } catch (err) {
        console.log(err.message);
        res.render('admin/index', {
            errorMessage: 'Error in Saving',
            username: name
        });
    }
});

module.exports = router;