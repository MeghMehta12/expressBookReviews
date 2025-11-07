const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  if(req.body.username && req.body.password){
    let uname = req.body.username;
    let pwd = req.body.password;
    if(users?.length > 0 && users.find(x => x.username === uname))
        return res.send("User already exists");
    if(isValid(uname))
        users.push({'username':uname, 'password':pwd});
    else 
        return res.send("Invalid username");        
    return res.send("User registered succesfuly");
  }
  return res.send("Username and Password required");
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    if(!req.session.user)
        return res.status(403).json({"message":"Unauthorized access"});
    const allBooks = await Promise.resolve(books);
    return res.status(200).json(allBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    if(!req.session.user)
        return res.status(403).json({"message":"Unauthorized access"});

    const allBooks = await Promise.resolve(books);
    if(allBooks[req.params.isbn])
        return res.send(`Book details for ${req.params.isbn} : ${JSON.stringify(allBooks[req.params.isbn])}`);
    else 
        return res.send("No book found");
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    if(!req.session.user)
        return res.status(403).json({"message":"Unauthorized access"});

    const allBooks = await Promise.resolve(books);
    let books = Object.values(allBooks).filter(x => x.author === req.params.author);
    if(books)
        return res.send(`Book by author ${req.params.author} : ${JSON.stringify(books)}`);
    else 
        return res.send("No books found");
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    if(!req.session.user)
        return res.status(403).json({"message":"Unauthorized access"});

    const allBooks = await Promise.resolve(books);
    let books = Object.values(allBooks).filter(x => x.title === req.params.title);
    if(books)
        return res.send(`Book details for title ${req.params.title} : ${JSON.stringify(books)}`);
    else 
        return res.send("No books found");
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
    if(!req.session.user)
        return res.status(403).json({"message":"Unauthorized access"});

    const allBooks = await Promise.resolve(books);
    let book = allBooks[req.params.isbn];
    if(book)
        return res.send(`Book reviews for title ${book.title} : ${JSON.stringify(books.reviews)}`);
    else 
        return res.send("No book found");
});

module.exports.general = public_users;
