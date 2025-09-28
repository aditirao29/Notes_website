import React, { useState } from 'react';
import './FlashcardDisplay.css'; 
import { FaTimes, FaRedo } from 'react-icons/fa';

const Flashcard = ({ card, isDarkMode }) => {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <div className={`flashcard-container ${isDarkMode ? 'dark-mode-card' : ''}`}>
            <span className="card-number">{showAnswer ? 'A:' : 'Q:'}</span>
            <p className="card-text">{showAnswer ? card.answer : card.question}</p>
            <button 
                className="see-answer-btn"
                onClick={() => setShowAnswer(prev => !prev)}
            >
                {showAnswer ? 'Show Question ←' : 'See Answer →'}
            </button>
        </div>
    );
};

export default function FlashcardDisplay({ cards, onClose, isDarkMode }) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const navigateCard = (direction) => {
        let newIndex;
        if (direction === 'next') {
            newIndex = (currentCardIndex + 1) % cards.length;
        } else if (direction === 'prev') {
            newIndex = (currentCardIndex - 1 + cards.length) % cards.length;
        } else if (direction === 'startOver') {
            newIndex = 0;
        } else return;

        setCurrentCardIndex(newIndex);
    };

    if (!cards || cards.length === 0) return null;
    const currentCard = cards[currentCardIndex];

    return (
        <div className="flashcard-overlay">
            <div className={`flashcard-modal ${isDarkMode ? 'dark-mode-modal' : ''}`}>
                <div className="modal-header">
                    <h2>Generated Flashcards ({currentCardIndex + 1}/{cards.length})</h2>
                    <button onClick={onClose} className="close-btn"><FaTimes /></button>
                </div>
                
                <div className="card-area">
                    <Flashcard card={currentCard} isDarkMode={isDarkMode} />
                </div>
                
                <div className="card-navigation">
                    <button onClick={() => navigateCard('prev')} className="nav-btn">Previous</button>
                    <button onClick={() => navigateCard('next')} className="nav-btn">Next</button>
                    <button onClick={() => navigateCard('startOver')} className="nav-btn redo-btn">
                        <FaRedo /> Start Over
                    </button>
                </div>
            </div>
        </div>
    );
}
