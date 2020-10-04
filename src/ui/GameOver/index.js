const GameOver = ({ score = 0, onRetry }) => (
    <div className='box game-over'>
        <p className="game-over-text">
            <span className='score-label'>Your score: </span>
            <span className='score-value'>{score} km</span>
        </p>
        <button
            className='button game-over-button'
            onClick={onRetry}>
            Try again, maybe?
        </button>
    </div>
);

export default GameOver;
