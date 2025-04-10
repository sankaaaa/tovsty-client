import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

function App() {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', authour: '', genre: '', year: '' });
    const [editingBook, setEditingBook] = useState(null); // For editing
    const [isAdmin, setIsAdmin] = useState(false); // Check if user is admin
    const [user, setUser] = useState(null); // User info
    const [loginData, setLoginData] = useState({ username: '', password: '' }); // Login form data
    const [errorMessage, setErrorMessage] = useState(''); // Error message
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [showLoginModal, setShowLoginModal] = useState(false); // State for login modal

    // Check if user is an admin after login
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.role === 'admin') {
            setIsAdmin(true);
            setUser(storedUser);
        }
    }, []);

    // Fetch books list
    useEffect(() => {
        axios.get('/books')
            .then(response => setBooks(response.data))
            .catch(error => console.error('Error fetching books:', error));
    }, []);

    // Handle login form change
    const handleLoginChange = (event) => {
        const { name, value } = event.target;
        setLoginData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle login submission
    const handleLogin = (event) => {
        event.preventDefault();
        if (loginData.username === 'admin' && loginData.password === 'password') {
            const loggedInUser = { username: 'admin', role: 'admin' };
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            setIsAdmin(true);
            setUser(loggedInUser);
            setErrorMessage('');
            setShowLoginModal(false); // Close login modal
        } else {
            setErrorMessage('Invalid username or password');
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsAdmin(false);
        setUser(null);
    };

    // Add new book
    const handleAddBook = (event) => {
        event.preventDefault();
        axios.post('/books', newBook)
            .then(response => {
                setBooks(prevBooks => [...prevBooks, response.data]);
                setNewBook({ title: '', authour: '', genre: '', year: '' });
                setShowModal(false); // Close modal
            })
            .catch(error => console.error('Error adding book:', error));
    };

    // Delete a book
    const handleDeleteBook = (id) => {
        axios.delete(`/books/${id}`)
            .then(() => {
                setBooks(books.filter(book => book.id !== id));
            })
            .catch(error => console.error('Error deleting book:', error));
    };

    // Edit a book
    const handleEditBook = (book) => {
        setEditingBook(book);
        setNewBook({ title: book.title, authour: book.authour, genre: book.genre, year: book.year });
        setShowModal(true); // Open modal
    };

    const handleUpdateBook = (event) => {
        event.preventDefault();
        axios.put(`/books/${editingBook.id}`, newBook)
            .then(response => {
                setBooks(books.map(book => (book.id === editingBook.id ? response.data : book)));
                setNewBook({ title: '', authour: '', genre: '', year: '' });
                setEditingBook(null);
                setShowModal(false); // Close modal
            })
            .catch(error => console.error('Error updating book:', error));
    };

    // Handle form input change
    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewBook(prevBook => ({
            ...prevBook,
            [name]: value
        }));
    };

    // Render login form
    const renderLoginForm = () => {
        return (
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                name="username"
                                value={loginData.username}
                                onChange={handleLoginChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                            />
                        </div>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <Button type="submit" variant="primary">Login</Button>
                    </form>
                </Modal.Body>
            </Modal>
        );
    };

    // Render books page
    const renderBooksPage = () => {
        return (
            <div className="container mt-5">
                <h1 className="mb-4">Book List</h1>

                {/* Add Book Button */}
                {isAdmin && (
                    <div className="mb-4">
                        <Button variant="primary" onClick={() => { setShowModal(true); setEditingBook(null); }}>Add Book</Button>
                    </div>
                )}

                {/* Books List */}
                <div className="row">
                    {books.length === 0 ? (
                        <div className="col-12">
                            <div className="alert alert-warning" role="alert">
                                No books available.
                            </div>
                        </div>
                    ) : (
                        books.map(book => (
                            <div className="col-md-4 mb-4" key={book.id}>
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">{book.title}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{book.authour}</h6>
                                        <p className="card-text"><strong>Genre:</strong> {book.genre}</p>
                                        <p className="card-text"><strong>Year:</strong> {book.year}</p>

                                        {/* Admin actions */}
                                        {isAdmin && (
                                            <div>
                                                <button onClick={() => handleEditBook(book)} className="btn btn-warning me-2">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteBook(book.id)} className="btn btn-danger">
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Logout Button */}
                {isAdmin && (
                    <Button variant="secondary" onClick={handleLogout}>Logout</Button>
                )}
            </div>
        );
    };

    return (
        <div>
            {!user ? (
                <>

                    {renderLoginForm()}
                    <div className="container mt-5">
                        <h4>Guest Book List</h4>
                        <div className="row">
                            {books.map(book => (
                                <div className="col-md-4 mb-4" key={book.id}>
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">{book.title}</h5>
                                            <h6 className="card-subtitle mb-2 text-muted">{book.authour}</h6>
                                            <p className="card-text"><strong>Genre:</strong> {book.genre}</p>
                                            <p className="card-text"><strong>Year:</strong> {book.year}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="primary" onClick={() => setShowLoginModal(true)}>
                            Login
                        </Button>
                    </div>

                </>
            ) : renderBooksPage()}

            {/* Modal for adding/editing books */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingBook ? 'Edit Book' : 'Add Book'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={editingBook ? handleUpdateBook : handleAddBook}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Title"
                                name="title"
                                value={newBook.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Author"
                                name="authour"
                                value={newBook.authour}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Genre"
                                name="genre"
                                value={newBook.genre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Year"
                                name="year"
                                value={newBook.year}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Button type="submit" variant="primary">
                            {editingBook ? 'Update' : 'Add'}
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default App;
