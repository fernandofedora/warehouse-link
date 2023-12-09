const express = require('express');
const router = express.Router();


router.get('/', (req,res, next) => {
    //res.send('index')
    res.render('index')
});

module.exports = router;
//app.use(mainRoutes)