import Toolbar from "./Toolbar";
import GameOver from "../GameOver";

const GameInterface = ({ onToolbarSelection, onRetry, isOver }) => (
    <>
        <h1 className="game-title small">Ferrovia Folle</h1>
        { isOver ? <GameOver onRetry={onRetry}/> : <Toolbar onToolbarSelection={onToolbarSelection}/> }
    </>
);

export default GameInterface;
