//bookController.js
const BookDAO = require('./bookDAO');

const BookController = {
    getAllBooks: async (req, res) => {
        try {
            const books = await BookDAO.getAllBooks();
            res.json(books);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getBookById: async (req, res) => {
        try {
            const book = await BookDAO.getBookById(req.params.id);
            if (book) res.json(book);
            else res.status(404).json({ message: 'Book not found' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    addBook: async (req, res) => {
        try {
            const { title, authour, genre, year } = req.body;
            const newBook = await BookDAO.addBook(title, authour, genre, year);
            res.status(201).json(newBook);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updateBook: async (req, res) => {
        try {
            const { title, authour, genre, year } = req.body;
            const updatedBook = await BookDAO.updateBook(req.params.id, title, authour, genre, year);
            if (updatedBook) res.json(updatedBook);
            else res.status(404).json({ message: 'Book not found' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deleteBook: async (req, res) => {
        try {
            const deletedBook = await BookDAO.deleteBook(req.params.id);
            if (deletedBook) res.json(deletedBook);
            else res.status(404).json({ message: 'Book not found' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = BookController;
