const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    required: true,
    type: String
  },
  lastName: {
    type: String,
    required: true,

  },
  imageUrl:{
    type: String,
    

  },
  email: {
    type: String,
    required: true,

  },
  address: {
    type: String,

  },
  phone: {
    type: String,

  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  gender: {
    type: String,
    enum: ['male', 'female',''],
    default:''
  },
  birthDate: {
    type: Date,
  },
  
}, { timestamps: true });

const user = mongoose.model('User', userSchema);
module.exports = user;


