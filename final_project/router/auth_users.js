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
            req.session.user = uname;
            return res.send("User logged in succesfully");
        }
    }
    res.send("Username password required")
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if(req.session.user){
        if(req.params.isbn){
            let book = users[req.params.isbn];
            if(book){
                let existingReview = Object.values(book.reviews).find(x => x.username === req.session.user);
                if(existingReview){
                    existingReview.comment = req.query.review;
                    return res.send("Review updated succesfully");
                } 
                book.reviews.push({username: req.session.user, comment: req.query.review});
                return res.send("Review added succesfully");
            }
            return res.send(`No book found for ISBN : ${req.params.isbn}`);
        }
    }
    return res.status(403).json({"message": "Unauthorized access"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    if(req.session.user){
        if(req.params.isbn){
            let book = users[req.params.isbn];
            if(book){
                let existingReview = Object.values(book.reviews).find(x => x.username === req.session.user);
                if(existingReview){
                    book.reviews = book.reviews.filter(x => x.username !== req.session.user);
                    return res.send("Review deleted succesfully");
                } 
                return res.send("Review does not exist");
            }
            return res.send(`No book found for ISBN : ${req.params.isbn}`);
        }
    }
    return res.status(403).json({"message": "Unauthorized access"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;