const express = require('express');
const router = express.Router();
const userAuth = require("../controller/userAuth");


router.get('/auth/google', userAuth.googleAuth);
router.get('/google/callback',userAuth.callback);


module.exports = router;
