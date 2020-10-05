import Toolbar from "./Toolbar";
import GameOver from "../GameOver";

const GameInterface = ({ onToolbarSelection, onRetry, isOver, score, toolbarSelection }) => (
    <>
        <h1 className="game-title small">Ferrovia Folle</h1>
        { isOver ?
            <GameOver score={score} onRetry={onRetry}/> :
            <Toolbar
                toolbarSelection={toolbarSelection}
                score={score}
                onToolbarSelection={onToolbarSelection}/>
        }
    </>
);

export default GameInterface;
