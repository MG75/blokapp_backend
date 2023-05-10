var express = require('express')
var connection = require('../database.js')
var router = express.Router()

router.get('/display/:id', (req, res) =>{
    const id = req.params.id;
    console.log(id, req.query);
    connection.query('SELECT * FROM posts WHERE building_id = ? ', [id], (err, result) =>{
        if (err) throw err;
        console.log('connected');
        res.json(result);
    })
})

router.post('/new', (req, res) =>{
    const [title, description, expiery_date, user_Id, blok_id] = req.body;
    connection.query('INSERT INTO posts (title, description, expiery_date, user_id, building_id)', [title, description, expiery_date, user_Id, blok_id], (err, result) => {
        if (err) throw err;
    })
})

router.post('/edit')

module.exports = router;