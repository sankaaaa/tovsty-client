import React, {useEffect, useState} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import BookCard from './BookCard';


function App() {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({title: '', authour: '', genre: '', year: ''});
    const [editingBook, setEditingBook] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const [loginData, setLoginData] = useState({username: '', password: ''});
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.role === 'admin') {
            setIsAdmin(true);
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {
        const fetchBooks = () => {
            axios.get('/books')
                .then(response => setBooks(response.data))
                .catch(error => console.error('Error fetching books:', error));
        };
        fetchBooks();
        const intervalId = setInterval(fetchBooks, 2000);
        return () => clearInterval(intervalId);
    }, []);


    const handleLoginChange = (event) => {
        const {name, value} = event.target;
        setLoginData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleLogin = (event) => {
        event.preventDefault();
        if (loginData.username === 'admin' && loginData.password === '11') {
            const loggedInUser = {username: 'admin', role: 'admin'};
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            setIsAdmin(true);
            setUser(loggedInUser);
            setErrorMessage('');
            setShowLoginModal(false);
        } else {
            setErrorMessage('Invalid username or password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsAdmin(false);
        setUser(null);
    };

    const handleAddBook = (event) => {
        event.preventDefault();
        axios.post('/books', newBook)
            .then(response => {
                setBooks(prevBooks => [...prevBooks, response.data]);
                setNewBook({title: '', authour: '', genre: '', year: ''});
                setShowModal(false);
            })
            .catch(error => console.error('Error adding book:', error));
    };

    const handleDeleteBook = (id) => {
        axios.delete(`/books/${id}`)
            .then(() => {
                setBooks(books.filter(book => book.id !== id));
            })
            .catch(error => console.error('Error deleting book:', error));
    };

    const handleEditBook = (book) => {
        setEditingBook(book);
        setNewBook({title: book.title, authour: book.authour, genre: book.genre, year: book.year});
        setShowModal(true);
    };

    const handleUpdateBook = (event) => {
        event.preventDefault();
        axios.put(`/books/${editingBook.id}`, newBook)
            .then(response => {
                setBooks(books.map(book => (book.id === editingBook.id ? response.data : book)));
                setNewBook({title: '', authour: '', genre: '', year: ''});
                setEditingBook(null);
                setShowModal(false);
            })
            .catch(error => console.error('Error updating book:', error));
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setNewBook(prevBook => ({
            ...prevBook,
            [name]: value
        }));
    };

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

    const renderBooksPage = () => {
        return (
            <div className="container mt-5">
                <h1 className="mb-4">Book List</h1>

                {isAdmin && (
                    <div className="mb-4">
                        <Button variant="primary" onClick={() => {
                            setShowModal(true);
                            setEditingBook(null);
                        }}>Add Book</Button>
                    </div>
                )}

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
                                <BookCard
                                    book={book}
                                    isAdmin={isAdmin}
                                    onEdit={handleEditBook}
                                    onDelete={handleDeleteBook}
                                />
                            </div>
                        ))
                    )}
                </div>


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
                            {books.length === 0 ? (
                                <div className="col-12">
                                    <div className="alert alert-warning" role="alert">
                                        No books available.
                                    </div>
                                </div>
                            ) : (
                                books.map(book => (
                                    <div className="col-md-4 mb-4" key={book.id}>
                                        <BookCard
                                            book={book}
                                            isAdmin={isAdmin}
                                            onEdit={handleEditBook}
                                            onDelete={handleDeleteBook}
                                        />
                                    </div>
                                ))
                            )}
                        </div>

                        <Button variant="primary" onClick={() => setShowLoginModal(true)}>
                            Login
                        </Button>
                    </div>

                </>
            ) : renderBooksPage()}

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
