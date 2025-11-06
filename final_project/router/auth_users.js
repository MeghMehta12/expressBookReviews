const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.find(x => x.username === username && x.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    if(req.body.username && req.body.password)
    {
        let uname = req.body.username;
        let pwd = req.body.password;
        if(authenticatedUser(uname, pwd))
        {
            const token = req.headers.authorization?.split(' ')[1];
            if(jwt.verify(token, process.env.JWT_SECRET))
                return res.send("User already logged in");
            jwt.sign(
                { id: uname, email: uname }, 
                process.env.JWT_SECRET,             
                { expiresIn: '1h' }                
            );
            return res.send("User logged in succesfully");
        }
    }
    res.send("Username password required")
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
