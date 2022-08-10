const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const session = require("express-session")
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

function isAuthenticated (req, res, next) {
  if (req.session.user) next()
  else next('route')
}

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong credentials!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong credentials!");

    
    const { password, ...others } = user._doc;
   
    res.status(200).json(others);
   
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', function(req, res){
  if(!req.session.user)
  {
    return res.status(401).send();
  }
  return res.status(200).json("welcome");
});

module.exports = router;
