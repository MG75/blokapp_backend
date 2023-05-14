var express = require('express')
var connection = require('../database.js')
const bcrypt = require('bcrypt')
var router = express.Router()

router.post('/login', express.urlencoded({ extended: true }), (req, res) => {
    const {mail, password } = req.body;
    console.log(mail)
    console.log(password)
  
    connection.query('SELECT * FROM users WHERE email = ?', [mail], async (err, result) => {
      
      if (err) {
        throw err;
      }
  
      if (result.length > 0) {
        const user = result[0];
        if (user.admin === 1){
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log(result[0])
  
        if (isPasswordMatch) {
            res.redirect('./ShowUsers');
          console.log('Admin logged in');
        } else {
          res.status(401).send('Invalid username or password');
        }
      } else {
        res.status(401).send('Invalid username or password');
      }}
    });

});

router.get('/ShowUsers', (req, res) =>{
  connection.query('SELECT *, u.id AS uid, b.id AS selectbuildingId, b.adress AS selectbuildingAdress FROM users u INNER JOIN buildings b ON b.id = u.building_id', (err, users) =>{
    if (err) throw err;
    connection.query('SELECT * FROM buildings', [users.selecteduildingId], (err, bloki) =>{
      if (err) throw err;
      console.log(users);
      res.render('users', {users, bloki})
    })
    
  })
})

router.post('/updateusers', (req, res) =>{
  const {name_surname, mail, uid, address} = req.body;
  
    connection.query('UPDATE users SET name_surname = ?, email = ?, building_id = ? WHERE id = ?', [name_surname, mail, address, uid], (err, result) =>{
      if (err) throw err;
      console.log(result);
        res.redirect('./ShowUsers')
    })
})

router.get('/ShowBuildings', (req, res) =>{
  connection.query('SELECT * FROM buildings', (err, bloki) =>{
      if (err) throw err;
      console.log('here')

      res.render('bloki', { bloki })
  })
})

router.post('/updatbuildings', (req, res) =>{
  const {name, bid, adress} = req.body;
  console.log('hi')
    connection.query('UPDATE buildings SET name = ?, adress = ? WHERE id = ?', [name, adress, bid], (err, result) =>{
      if (err) throw err;
      console.log(result);
        res.redirect('./ShowBuildings')
    })
})

router.post('/createbuilding', (req, res) =>{
  const {name, adress} = req.body;
    console.log(req.body, name, adress)
    if(name != null && adress != null){
    connection.query('INSERT INTO buildings (name, adress) VALUES (?, ?)', [name, adress], (err, result) =>{
      if (err) throw err;
      console.log(result);
    })
  }
  res.redirect('./ShowBuildings')
})

router.get('/ShowPosts', (req, res) =>{
  connection.query('SELECT *, u.name_surname AS username, b.adress AS location FROM posts p INNER JOIN users u ON u.id = p.user_id INNER JOIN buildings b ON b.id = p.building_id', (err, posts) =>{
      if (err) throw err;
      res.render('posts', {posts})
  })
})

router.post('/updatposts', (req, res) =>{
  const {title, description, pid} = req.body;
    connection.query('UPDATE posts SET title = ?, description = ? WHERE id = ?', [title, description, pid], (err, result) =>{
      if (err) throw err;
      console.log(result);
        res.redirect('./ShowPosts')
    })
})

module.exports = router;