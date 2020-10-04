import Toolbar from "./Toolbar";
import GameOver from "../GameOver";

const GameInterface = ({ onToolbarSelection, onRetry, isOver, score }) => (
    <>
        <h1 className="game-title small">Ferrovia Folle</h1>
        { isOver ?
            <GameOver score={score} onRetry={onRetry}/> :
            <Toolbar score={score} onToolbarSelection={onToolbarSelection}/>
        }
    </>
);

export default GameInterface;
