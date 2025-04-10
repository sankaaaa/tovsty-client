import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        axios.get('/books') // Оскільки у тебе налаштовано проксі, достатньо використовувати /books
            .then(response => setBooks(response.data))
            .catch(error => console.error('Error fetching books:', error));
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Список книжок</h1>
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
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default App;
