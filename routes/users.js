var express = require('express')
var connection = require('../database.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const secretKey = "blokapp11234";
var router = express.Router()
const saltRounds = 10

router.post('/login', express.urlencoded({ extended: true }), (req, res) => {
    const {email, password } = req.body;
    console.log(email)
    console.log(password)
  
    connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      
      if (err) {
        throw err;
      }
  
      if (result.length > 0) {
        const user = result[0];
  
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log(result[0])
  
        if (isPasswordMatch) {
          console.log('succesfull login');
          console.log('User logged in');
          const user2 = { id: user.id, email: user.email, username: user.name_surname, blok: user.building_id };
          const token = CreateToken(user2);
          res.json({ token });
          console.log(token);
        } else {
          res.status(401).send('Invalid username or password');
        }
      } else {
        res.status(401).send('Invalid username or password');
      }
    });

});

function CreateToken(user) {
  const expiresIn = '7d';
  const token = jwt.sign(user, secretKey, {expiresIn});
  return token;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    console.log('validated');
    req.user = user;
    next();
  });
}

router.get('/validate-LoginToken', authenticateToken, (req, res) => {
  console.log('through');
  res.sendStatus(200);
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
        
        const user = {id: result.insertId, email: email, username: name, blok: blok};
        const token = CreateToken(user);
        res.json({token});
      });
    });
  });

  

module.exports = router;