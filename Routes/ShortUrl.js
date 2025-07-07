const express = require('express');
const router = express.Router();
const axios = require('axios');
const { requireAuth }= require('../middleware/auth')
const {nanoid} = require('nanoid');
const redisuse = require('./redisdata');

router.use('/', redisuse);

router.get('/data',requireAuth, async (req, res) => {
  try {

    const response = await axios.get("https://jsonplaceholder.typicode.com/todos");

    res.json(response.data);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id',requireAuth, async (req, res) => {
  const {id } = req.params;

  try {
    const apiUrl = `https://jsonplaceholder.typicode.com/todos/${id}`;

  
    const response = await axios.get(apiUrl);

    const shortUrl= nanoid(7); 

    res.json({
      shortUrl,
      data: response.data
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch or generate short Url' });
  }
});

module.exports = router;
