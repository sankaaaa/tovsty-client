import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', authour: '', genre: '', year: '' });
    const [editingBook, setEditingBook] = useState(null); // Для редагування
    const [isAdmin, setIsAdmin] = useState(false); // Чи є користувач адміністратором
    const [user, setUser] = useState(null); // Збереження інформації про користувача
    const [loginData, setLoginData] = useState({ username: '', password: '' }); // Для форми логіну
    const [errorMessage, setErrorMessage] = useState(''); // Повідомлення про помилки

    // Перевірка на адміністратора після логіну
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user')); // Перевіряємо, чи є користувач в локальному сховищі
        if (storedUser && storedUser.role === 'admin') {
            setIsAdmin(true);
            setUser(storedUser);
        }
    }, []);

    // Завантаження списку книжок
    useEffect(() => {
        axios.get('/books')
            .then(response => setBooks(response.data))
            .catch(error => console.error('Error fetching books:', error));
    }, []);

    // Форма логіну
    const handleLoginChange = (event) => {
        const { name, value } = event.target;
        setLoginData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Логін користувача
    const handleLogin = (event) => {
        event.preventDefault();
        // Приклад перевірки: правильні логін/пароль
        if (loginData.username === 'admin' && loginData.password === 'password') {
            const loggedInUser = { username: 'admin', role: 'admin' };
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            setIsAdmin(true);
            setUser(loggedInUser);
            setErrorMessage(''); // Очистити помилку
        } else {
            setErrorMessage('Невірний логін або пароль');
        }
    };

    // Додавання нової книжки
    const handleAddBook = (event) => {
        event.preventDefault();
        axios.post('/books', newBook)
            .then(response => {
                setBooks(prevBooks => [...prevBooks, response.data]);
                setNewBook({ title: '', authour: '', genre: '', year: '' });
            })
            .catch(error => console.error('Error adding book:', error));
    };

    // Видалення книжки
    const handleDeleteBook = (id) => {
        axios.delete(`/books/${id}`)
            .then(() => {
                setBooks(books.filter(book => book.id !== id)); // Видаляємо книгу з локального списку
            })
            .catch(error => console.error('Error deleting book:', error));
    };

    // Редагування книжки
    const handleEditBook = (book) => {
        setEditingBook(book);
        setNewBook({ title: book.title, authour: book.authour, genre: book.genre, year: book.year });
    };

    const handleUpdateBook = (event) => {
        event.preventDefault();
        axios.put(`/books/${editingBook.id}`, newBook)
            .then(response => {
                setBooks(books.map(book => (book.id === editingBook.id ? response.data : book)));
                setNewBook({ title: '', authour: '', genre: '', year: '' });
                setEditingBook(null); // Завершити редагування
            })
            .catch(error => console.error('Error updating book:', error));
    };

    // Оновлення полів форми
    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewBook(prevBook => ({
            ...prevBook,
            [name]: value
        }));
    };

    // Логіка для показу або приховування інтерфейсу
    const renderLoginForm = () => {
        return (
            <div className="container mt-5">
                <h2>Вхід</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Логін"
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
                            placeholder="Пароль"
                            name="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                        />
                    </div>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <button type="submit" className="btn btn-primary">Увійти</button>
                </form>
            </div>
        );
    };

    const renderBooksPage = () => {
        return (
            <div className="container mt-5">
                <h1 className="mb-4">Список книжок</h1>

                {/* Форма для додавання/редагування книжки */}
                {isAdmin && (
                    <div className="mb-4">
                        <h2>{editingBook ? 'Редагувати книжку' : 'Додати нову книжку'}</h2>
                        <form onSubmit={editingBook ? handleUpdateBook : handleAddBook}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Назва"
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
                                    placeholder="Автор"
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
                                    placeholder="Жанр"
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
                                    placeholder="Рік видання"
                                    name="year"
                                    value={newBook.year}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                {editingBook ? 'Оновити' : 'Додати'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Список книжок */}
                <div className="row">
                    {books.length === 0 ? (
                        <div className="col-12">
                            <div className="alert alert-warning" role="alert">
                                Немає книжок для відображення.
                            </div>
                        </div>
                    ) : (
                        books.map(book => (
                            <div className="col-md-4 mb-4" key={book.id}>
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">{book.title}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{book.authour}</h6>
                                        <p className="card-text"><strong>Жанр:</strong> {book.genre}</p>
                                        <p className="card-text"><strong>Рік видання:</strong> {book.year}</p>

                                        {/* Кнопки для адміністратора */}
                                        {isAdmin && (
                                            <div>
                                                <button onClick={() => handleEditBook(book)} className="btn btn-warning me-2">
                                                    Редагувати
                                                </button>
                                                <button onClick={() => handleDeleteBook(book.id)} className="btn btn-danger">
                                                    Видалити
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            {!user ? renderLoginForm() : renderBooksPage()}
        </div>
    );
}

export default App;
