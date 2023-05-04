const express = require('express')
const router = express.Router()

router.route('/') // already at /users/
    .get()
    .post()
    .patch()
    .delete()

module.exports = router