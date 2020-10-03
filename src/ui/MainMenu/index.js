const MainMenu = ({ onStart }) => (
    <div className="main-menu fancy-text">
        <h1 className="game-title">Ferrovia Folle</h1>
        <h2 className="game-subtitle">(Crazy Railway)</h2>
        <p className="game-instructions">Instructions go here</p>
        <button className="start-button" onClick={onStart}>
            Start
        </button>
    </div>
);

export default MainMenu;
