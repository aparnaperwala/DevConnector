const mongoose = require('mongoose');
const schema = mongoose.schema;

const UserSchema = new Schema({
  name:{
    type: String,
    required : true
  },
  email:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type:string,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }


});

module.exports = User = mongoose.model('users', UserSchema);