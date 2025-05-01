const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return (username && username.trim().length > 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const matchingUsers = users.filter((user)=>{
    return user.username === username && user.password === password;
  });
  return matchingUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required for login." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username 
    }, 'access', { expiresIn: 60 * 60 });

  req.session.authorization = {
      accessToken: accessToken,
      username: username 
    }

    return res.status(200).json({ message: "User successfully logged in.", accessToken: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid login. Please check your username and password." }); // 401 Unauthorized
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn; 
  const review = req.query.review; 
  const username = req.session.authorization.username; 

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: `Review for ISBN ${isbn} by ${username} added/modified successfully.` });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; 
    const username = req.session.authorization.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
  
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: `Review for ISBN ${isbn} by user ${username} deleted successfully.` });
    } else {
      return res.status(404).json({ message: `No review found for ISBN ${isbn} by user ${username} to delete.` });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
