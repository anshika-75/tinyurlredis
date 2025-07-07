const {Router} = require('express');
const Routes = Router();
const User = require('../models/users');
const  jwt = require('jsonwebtoken');
const JWT_SECRET = 'anshikagupta';
const bcrypt = require('bcrypt');
const shortUrl = require('../Routes/ShortUrl')

//post user se info lena
Routes.post('/signup', async (req, res) => {
    //{} kyu use hua - jab hame ek se jaida data chaiye toh use krte 
  const { email, password } = req.body;


  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1hr' });
    ///change karenge isko 
    //cookie client side save krti hai 

    res.cookie('tokenname', token, {
    httpOnly: true,           
    secure: false,            
    maxAge: 60 * 60 * 1000,   // 1 hour in milisecond 
  })
  .status(201)
  .json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// yaha se sign in wala start ho gaya 
//time lagega user ko email password me iss liye async await 
//kuch glt bhi ho sakta iss liye try catch 
Routes.post('/signin', async(req,res)=>{
        const {email,password}= req.body;

try{
  //object - user
  //mongo ki property hoti , yaha user ko sab kuch mil jayega sirf email nhi 
        const user=await User.findOne({email})
        if(!user)return res.status(400).json({ error: 'Invalid email' });

        const validate= await bcrypt.compare
        (password, user.password);
        if(!validate) return res.status(400).json({ error: 'Invalid password' });


const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      maxAge: 60 * 60 * 1000, // 1 hour
    }).status(200).json({ message: 'Signin successful' });

        
}catch(err){
console.error('Error during signin:', err);
    res.status(500).json({ error: 'Signin failed' });
}

})

Routes.post('/signout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
  });

  return res.status(200).json({ message: 'Signout successful' });
});

Routes.use('/shortUrl',shortUrl);

module.exports = Routes ;