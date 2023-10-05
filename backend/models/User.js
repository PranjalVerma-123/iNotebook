const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
  });
  const User = mongoose.model('user', UserSchema);
  module.exports = User;

  //Kriss Kiss , Olivia-Madison , https://hdporn92.com/publicagent-ann-joy-create-content-with-me/ , 
  // https://hdporn92.com/shoplyfter-mina-luxx-case-no-7906262-brat-scared-straight/
  // telari love (octupus)