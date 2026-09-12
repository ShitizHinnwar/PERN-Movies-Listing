const express = require('express')

const router = express.router();

router.post('/movie', (req, res) => {
    res.send("Movie Added")
})

router.get('/movie', (req, res) => {
    res.send("Movie Added")
})

router.put('/movie', (req, res) => {
    res.send("Movie Added")
})

router.delete('/movie', (req, res) => {
    res.send("Movie Added")
})

module.exports = router