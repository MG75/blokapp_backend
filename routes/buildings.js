var express = require('express')
var connection = require('../database.js')
var router = express.Router()

router.get('/options', (req, res) => {
    // Get the options from the database
    connection.query('SELECT * FROM Buildings', (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error retrieving options from database');
      } else {
        // Send the options to the Flutter frontend
        console.log(results);
        res.json(results);
      }
    });
  });


module.exports = router;