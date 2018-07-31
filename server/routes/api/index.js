const router = require('express').Router();

router.use('/articles', require('./articles'));
router.use('/users', require('./users'));
//router.use('/stripe', require('./stripe'));

module.exports = router;
