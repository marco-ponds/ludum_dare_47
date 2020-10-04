import Toolbar from "./Toolbar";

const GameInterface = ({ onToolbarSelection }) => (
    <>
        <h1 className="game-title small">Ferrovia Folle</h1>
        <Toolbar onToolbarSelection={onToolbarSelection}/>
    </>
);

export default GameInterface;
