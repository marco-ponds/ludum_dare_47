import { parseScore } from "../../utils/parseScore";

const GameOver = ({ score = 0, onRetry }) => (
    <div className='box game-over'>
        <p className="game-over-text">
            <span className='score-label'>score: </span>
            <span className='score-value'>{parseScore(score)} km</span>
        </p>
        <button
            className='button game-over-button'
            onClick={onRetry}>
            Try again, maybe?
        </button>
    </div>
);

export default GameOver;
