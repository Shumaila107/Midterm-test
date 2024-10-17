const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Array of books
let books = ['The Hobbit', '1984', 'To Kill a Mockingbird', 'Moby Dick', 'Pride and Prejudice'];

// Set the port for the server
const PORT = 8080;

// Serve the instructions HTML file (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// GET /api/items - Retrieve the full list of books
app.get('/api/items', (req, res) => {
  res.json(books);
});

// GET /api/items/search?title=[partial title name] - Search for books by partial title match
app.get('/api/items/search', (req, res) => {
  const partialTitle = req.query.title.toLowerCase();
  const matchingBooks = books.filter(book => 
    book.toLowerCase().includes(partialTitle)
  );
  res.json(matchingBooks);
});

// GET /api/items/:id - Retrieve a book by its index
app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 0 && id < books.length) {
    res.json(books[id]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// POST /api/items - Add a new book to the collection
app.post('/api/items', (req, res) => {
  const newBook = req.body.title;
  if (newBook && typeof newBook === 'string') {
    books.push(newBook);
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } else {
    res.status(400).json({ message: "Invalid book title" });
  }
});

// PUT /api/items/:id - Update a book by its index
app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedTitle = req.body.title;
  if (id >= 0 && id < books.length && updatedTitle && typeof updatedTitle === 'string') {
    books[id] = updatedTitle;
    res.json({ message: "Book updated successfully", book: updatedTitle });
  } else {
    res.status(400).json({ message: "Invalid book ID or title" });
  }
});

// DELETE /api/items/:id - Remove a book from the collection by its index
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 0 && id < books.length) {
    const deletedBook = books.splice(id, 1)[0];
    res.json({ message: "Book deleted successfully", book: deletedBook });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});