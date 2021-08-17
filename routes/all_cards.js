//code for rendering the home page of the cbuilder website
const express = require('express');
const router = express.Router();
const Card = require('../models/cards');

router.get('/', async (req, res) => {
    const cards = await Card.find({});
    res.render('index', {
        card: cards,
    });
});


module.exports = router;