const {Router}= require('express')
const route= Router();
const { createClient } = require('redis');
const axios = require('axios');
const {requireAuth} = require('../middleware/auth');


const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379', 
});

client.on('error', err => console.error('Redis Client Error:', err));

(async () => {
  await client.connect();
})();


route.get('/redis-data',requireAuth,async(req,res)=>{
 const Cache = await client.get('todos');
    if (Cache) return res.json(JSON.parse(Cache));
    
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
    await client.set('todos', JSON.stringify(response.data));
    await client.expire('todos', 30);
    return res.json(response.data);

})


module.exports= route;
