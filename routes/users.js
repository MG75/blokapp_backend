var express = require('express')
var connection = require('../database.js')
const bcrypt = require('bcrypt')
var router = express.Router()
const saltRounds = 10



router.get('/login', express.urlencoded({ extended: true }), (req, res) => {
    const {username, password } = req.query;
    console.log(username)
    console.log(password)
  
    connection.query('SELECT * FROM uporabniki WHERE email = ?', [username], async (err, result) => {
      
      if (err) {
        throw err;
      }
  
      if (result.length > 0) {
        const user = result[0];
  
        const isPasswordMatch = await bcrypt.compare(password, user.geslo);
        console.log(result[0])
  
        if (isPasswordMatch) {
          console.log('User logged in');
          const user2 = { id: user.id, email: user.email, username: username };
          req.session.user = user2;
          console.log(req.session.user);
          res.redirect('/kraji');
        } else {
          res.status(401).send('Invalid username or password');
        }
      } else {
        res.status(401).send('Invalid username or password');
      }
    });

});

router.post('/register', express.urlencoded({ extended: true }), (req, res) => {
    const { name, email, password, blok} = req.body;
    console.log(req.body);
    const sql = `INSERT INTO Users (name_surname, email, password, building_id) VALUES (?, ?, ?, ?)`;
  
    // Hash the password before storing it in the database
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        throw err;
      }
      
      connection.query(sql, [name, email, hash, blok], (err, result) => {
        if (err) {
          throw err;
        }
        console.log('User registered');
        res.redirect('/');
      });
    });
  });

module.exports = router;