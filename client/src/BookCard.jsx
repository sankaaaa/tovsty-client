import React from 'react';
import { Button } from 'react-bootstrap';

function BookCard({ book, isAdmin, onEdit, onDelete }) {
    return (
        <div className="card h-100">
            <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{book.authour}</h6>
                <p className="card-text"><strong>Genre:</strong> {book.genre}</p>
                <p className="card-text"><strong>Year:</strong> {book.year}</p>

                {isAdmin && (
                    <div>
                        <Button onClick={() => onEdit(book)} variant="warning" className="me-2">
                            Edit
                        </Button>
                        <Button onClick={() => onDelete(book.id)} variant="danger">
                            Delete
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookCard;
