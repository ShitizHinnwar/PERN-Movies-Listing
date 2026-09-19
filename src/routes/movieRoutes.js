import express from 'express';

const router = express.Router();

router.post('/movie', (req, res) => {
    res.send("Movie Added");
});

router.get('/movie', (req, res) => {
    res.send("Movie Fetched");
});

router.put('/movie', (req, res) => {
    res.send("Movie Updated");
});

router.delete('/movie', (req, res) => {
    res.send("Movie Deleted");
});

export default router;