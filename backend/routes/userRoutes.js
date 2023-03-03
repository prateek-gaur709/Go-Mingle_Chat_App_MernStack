const express = require('express');
const { registerUser, authUser } = require('../controllers/userController');

const router = express.Router();

//.route is used to chain get,post methods

//endpoint for registration ('/')
router.route('/').post(registerUser);

//endpoint for login- other way of writing
router.post('/login', authUser);

module.exports = router;
