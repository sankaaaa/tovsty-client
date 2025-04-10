//bookDAO.js
const pool = require('./db');

const BookDAO = {
    getAllBooks: async () => {
        const { rows } = await pool.query('SELECT * FROM books');
        return rows;
    },

    getBookById: async (id) => {
        const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        return rows[0];
    },

    addBook: async (title, authour, genre, year) => {
        const { rows } = await pool.query(
            'INSERT INTO books (title, authour, genre, year) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, authour, genre, year]
        );
        return rows[0];
    },

    updateBook: async (id, title, authour, genre, year) => {
        const { rows } = await pool.query(
            'UPDATE books SET title = $1, authour = $2, genre = $3, year = $4 WHERE id = $5 RETURNING *',
            [title, authour, genre, year, id]
        );
        return rows[0];
    },

    deleteBook: async (id) => {
        const { rows } = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
        return rows[0];
    }
};

module.exports = BookDAO;
