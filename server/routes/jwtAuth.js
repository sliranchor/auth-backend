const router = require("express").Router()
const pool = require("../db");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generateJWT");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");



//registration
router.post("/register", validInfo, async (req, res) =>{
  try {
    //define user
    const{name, email, password} = req.body;
    //define command to insert user into table
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [ email ]);
    //Check if user already exists
    if (user.rows.length != 0) {
      return res.status(401).send("User Already Exists!");
    }

    //Otherwise, BCrypt the entered password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(password, salt);

    //insert user into db
    const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [name, email, bcryptPassword]);

    //get JWT token for user
    const token = generateJWT(newUser.rows[0].user_id);

    res.json({token});



  } catch(err){
    console.error(err.message);
    res.status(500).send("Server Error");
  }

});

//login
router.post("/login", validInfo, async (req, res) =>{
  try {

    //get request body
    const { email, password } = req.body;

    //check if user exists, if exists match email
    const user = await pool.query("SELECT * FROM users where user_email = $1", [email]);

    if(user.rows.length === 0){
      return res.status(401).json("Email is incorrect, or user does not exist ");
    }

    //check if password matches with stored
    const passwordValid = await bcrypt.compare(password, user.rows[0].user_password);

    if(!passwordValid){
      return res.status(401).json("Password is incorrect");
    }

    const token = generateJWT(user.rows[0].user_id);
    res.json({token});
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");

    
  }




});
//check for verification
router.get("/isVerified", authorization, async(req, res) =>{
  try {
    res.json(true);
  

    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
    
  }
})

module.exports = router;
