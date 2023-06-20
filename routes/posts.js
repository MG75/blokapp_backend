var express = require('express')
var connection = require('../database.js')
var router = express.Router()

router.get('/display/:id', (req, res) =>{
    const id = req.params.id;
    const cas = new Date().toISOString().slice(0, 10);
    console.log(cas);
    console.log(id, req.query);
    connection.query('SELECT * FROM posts WHERE building_id = ? AND expiery_date > ?', [id, cas], (err, result) =>{
        if (err) throw err;
        console.log('connected');
        res.json(result);
    })
})

router.post('/new', (req, res) =>{
    const {title, description, date, uid, bid} = req.body;
    connection.query('INSERT INTO posts (title, description, expiery_date, user_id, building_id) VALUES (?,?,?,?,?)', [title, description, date, uid, bid], (err, result) => {
        if (err) throw err;
        console.log(result);
    })
})

router.post('/edit', (req, res) =>{
    const {pid, title, description} = req.body;
    connection.query('UPDATE posts SET title = ?, description = ? WHERE id =?', [title, description, pid], (err, result) =>{
        if (err) throw err;
        console.log(result);
    })
})

router.post('/delete', (req, res) =>{
    const{pid} = req.body;
    connection.query('DELETE FROM votes WHERE post_id = ?', [pid] ,(err, result) =>{
        if (err) throw err;
        connection.query('DELETE FROM posts WHERE id = ?', [pid], (err, result2) =>{
            if (err) throw err;
            console.log('removed');
        })
    } )
})

module.exports = router;