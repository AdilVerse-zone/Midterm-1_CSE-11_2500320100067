
const express = require('express');
const app = express();

app.use(express.json());

let books = [];

// Home route
app.get('/', (req, res) => {
    res.send('Library Management System API is running');
});

// TASK 2: Add Book
app.post('/api/books', (req, res) => {
    const { id, title, author, quantity } = req.body;

    if (!id || !title || !author || quantity === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity' });
    }

    if (books.find(b => String(b.id) === String(id))) {
        return res.status(409).json({ message: 'Duplicate book ID' });
    }

    const { available } = req.body;

const book = { id, title, author, quantity, available };
    books.push(book);

    res.status(201).json({
        message: 'Book added successfully',
        book: book
    });
});

// TASK 3: Get All Books
app.get('/api/books', (req, res) => {
    res.status(200).json(books);
});

// Get Book By ID
app.get('/api/books/:id', (req, res) => {
    const book = books.find(b => String(b.id) === req.params.id);

    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    res.status(200).json(book);
});
// TASK 4: Update Book
app.put('/api/books/:id', (req, res) => {

    const book = books.find(b => String(b.id) === req.params.id);

    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    const { id, title, author, quantity } = req.body;

    // Prevent ID change
    if (id !== undefined) {
        return res.status(400).json({
            message: 'Book ID cannot be changed'
        });
    }

    // Validate quantity
    if (quantity !== undefined &&
        (!Number.isInteger(quantity) || quantity <= 0)) {
        return res.status(400).json({
            message: 'Invalid quantity'
        });
    }

    // Update permitted details
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (quantity !== undefined) book.quantity = quantity;

    res.status(200).json({
        message: 'Book updated successfully',
        book: book
    });

});

// TASK 5: Delete Book
app.delete('/api/books/:id', (req, res) => {

    const index = books.findIndex(
        b => String(b.id) === req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    const book = books[index];

    // Check available books
    if (book.available < book.quantity) {
        return res.status(400).json({
            message: 'Cannot delete book. Some copies are issued.'
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: 'Book deleted successfully'
    });

});



// Start Server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

