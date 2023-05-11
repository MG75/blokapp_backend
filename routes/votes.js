var express = require('express')
var connection = require('../database.js');
var router = express.Router()

router.get('/get/:uid/:pid', (req, res) => {
    const uid = req.params.uid;
    const pid = req.params.pid;
    connection.query('SELECT * FROM votes WHERE user_id = ? AND post_id = ?', [uid, pid], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            connection.query('INSERT INTO votes (user_id, post_id) VALUES (?,?)', [uid, pid], (err, result2) => {
                if (err) throw err;

                const vote = {id: result2.inserId, value: 0};
                res.json(vote);
            })
        }else{
            const vote = result[0];
            console.log(result[0]);
            res.json(vote);
        }
    })
})

router.post('/makevote', (req, res) =>{
    const {value, pid, uid} = req.body;
    console.log(req.body);
    connection.query('UPDATE votes SET value = ? WHERE user_id = ? AND post_id = ?', [value, uid, pid], (err,result) =>{
        if(err) throw err;
    })
    connection.query('SELECT * FROM posts WHERE id = ?', [pid], (err, result) =>{
        if (err) throw err;
        var score = result.score;
        if(value === 1){
            score =+ 1;
            connection.query('UPDATE posts SET score = ? WHERE id = ?', [score, pid], (err,result2) =>{
                if (err) throw err;
                console.log('upvote');
            })
        }else{
            score =- 1;
            connection.query('UPDATE posts SET score = ? WHERE id = ?', [score, pid], (err,result2) =>{
                if (err) throw err;
                console.log('downvote');
            })
        }
    })

})


module.exports = router;