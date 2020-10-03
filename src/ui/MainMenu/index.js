const MainMenu = ({ onStart }) => (
    <div className="main-menu">
        <h1 className="game-title">Ferrovia Folle</h1>
        <h2 className="game-subtitle">(Crazy Railway)</h2>
        <button className="start-button" onClick={onStart}>
            Start
        </button>
    </div>
);

export default MainMenu;
