const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_Secret = "PranjalisagoodB$oy";
let success = false;
// Route 1:no loin required using POST : "/api/auth/createuser"
router.post('/createuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('password', 'password must be atleast 5 character').isLength({ min: 5 })
], async (req, res) => {
    // if there is error show them
    const errors = validationResult(req);
    success=false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ success ,errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        // check if email is already exists 
        if (user) {

            return res.status(400).json({success , error: "Sorry a user with this email already exists" })
        }
        //making salt for our password
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        //create new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_Secret);
        success=true
        res.json({ success , authToken });
        // res.send(user);
    } catch (error) {
        console.log(error.message);
        
        res.status(500).send("Internal Server Error!");
    }
})



// Route 2 :Login using POST : "/api/auth/login"
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter password').exists()
], async (req, res) => {
    // if there is error show them
    success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.status(400).json({ success ,errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {

            return res.status(400).json({ success ,errors: "Please try to login with correct Credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {

            return res.status(400).json({ success,errors: "Please try to login with correct Credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_Secret);
        success=true;
        res.send({success , authToken })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

//Route 3: Get loggedin user details using POST : "/api/auth/getuser"

router.post('/getuser', fetchuser,  async (req, res) => {

    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
module.exports = router