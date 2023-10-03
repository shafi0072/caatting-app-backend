const express = require('express');
const { findFriends } = require('../../helper/Friend/FindFriend');
const router = express.Router();

router.get('/users', findFriends)

module.exports = router