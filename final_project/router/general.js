const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const BASE_URL = "http://localhost:5000";

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }
  const userExists = users.find(user => user.username === username);
  if (userExists) {
      return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username: username, password: password }); // Add to the array

  return res.status(200).json({ message: "User successfully registered. You can now login." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let bookList = JSON.stringify(books, null, 4);
  return res.status(200).send(bookList);
});

// Task 10: Get the book list using Promise callbacks with Axios
public_users.get('/books', function (req, res) {
    axios.get(`${BASE_URL}/`)
        .then(response => {
            res.status(response.status).json(response.data);
        })
        .catch(error => {
            if (error.response) {
                res.status(error.response.status).json({ message: error.response.data });
            } else if (error.request) {
                res.status(500).json({ message: "Error fetching data: No response from server." });
            } else {
                res.status(500).json({ message: "Error setting up request: " + error.message });
            }
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
   return  res.status(404).json({ message: "Book not found" });
  }
 });

// Task 11: Get book details based on ISBN using Promise callbacks with Axios
public_users.get('/books/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then(response => {
            res.status(response.status).json(response.data);
        })
        .catch(error => {
             if (error.response) {
                res.status(error.response.status).json({ message: error.response.data });
            } else if (error.request) {
                res.status(500).json({ message: "Error fetching data: No response from server." });
            } else {
                res.status(500).json({ message: "Error setting up request: " + error.message });
            }
        });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchingBooks = []; 
  const isbns = Object.keys(books);

  isbns.forEach(isbn => {
    const book = books[isbn]; 
    if (book.author === author) {
      matchingBooks.push(book);
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 12: Get book details based on Author using Promise callbacks with Axios
public_users.get('/books/author/:author', function (req, res) {
    const author = req.params.author;
    axios.get(`${BASE_URL}/author/${author}`)
        .then(response => {
            res.status(response.status).json(response.data);
        })
        .catch(error => {
             if (error.response) {
                res.status(error.response.status).json({ message: error.response.data });
            } else if (error.request) {
                res.status(500).json({ message: "Error fetching data: No response from server." });
            } else {
                res.status(500).json({ message: "Error setting up request: " + error.message });
            }
        });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = []; 

  const isbns = Object.keys(books);

  isbns.forEach(isbn => {
    const book = books[isbn]; 

    if (book.title === title) {
      matchingBooks.push(book);
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 13: Get book details based on Title using Promise callbacks with Axios
public_users.get('/async/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`${BASE_URL}/title/${title}`)
        .then(response => {
            res.status(response.status).json(response.data);
        })
        .catch(error => {
             if (error.response) {
                res.status(error.response.status).json({ message: error.response.data });
            } else if (error.request) {
                res.status(500).json({ message: "Error fetching data: No response from server." });
            } else {
                res.status(500).json({ message: "Error setting up request: " + error.message });
            }
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
   return res.status(200).json(books[isbn].reviews);
  } else {
   return res.status(404).json({ message: "Book not found, cannot retrieve reviews" });
  }
});

module.exports.general = public_users;
