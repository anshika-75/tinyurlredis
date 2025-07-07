const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
},
{timestamps : true}
);
//USER ka hamse nata nhi , ye mongo me jakar check krta
//user denote kr rha hai userschema ko
module.exports = mongoose.model('User', userSchema);