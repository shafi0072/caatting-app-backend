const express = require('express');
const { verify, signIn, signUp, requestSend, follower, addFriend } = require('../../helper/Authentication/auth');
const router = express.Router();



router.post('/signUp', signUp)
router.post('/verify', verify);
router.post('/signIn', signIn);
router.put('/request-send', requestSend);
router.put('/addFriend', addFriend)

module.exports = router