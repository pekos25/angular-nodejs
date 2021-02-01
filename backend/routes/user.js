const express = require('express');

const Usercontrollers = require('../controllers/user');
//const user = require('../models/user');


const router = express.Router();


router.post("/singup", Usercontrollers.createUser)

router.post("/login", Usercontrollers.userLogin)

module.exports = router ;