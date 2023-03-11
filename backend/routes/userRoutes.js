const express = require('express');
const {
  registerUser,
  authUser,
  allUsers,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

//.route is used to chain get,post methods

//endpoint for registration ('/')
router.route('/').post(registerUser).get(protect, allUsers);

//endpoint for login- other way of writing
router.post('/login', authUser);

//search user api
// router.route('/').get(allUsers); //better to chain it above, bcoz of same endpoint

module.exports = router;
