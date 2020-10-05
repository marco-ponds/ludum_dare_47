import { playStartSound } from "../../level/sounds";

const MainMenu = ({ onStart }) => {
    
    const handleClick = () => {
        playStartSound();
        onStart();
    };

    return (
        <div className="main-menu fancy-text">
            <div className='menu-container box'>
                <h1 className="game-title">Ferrovia Folle</h1>
                <h2 className="game-subtitle">(Crazy Railway)</h2>
                <p className="game-instructions">Instructions go here</p>
                <button className="button" onClick={handleClick}>
                    Start
                </button>
            </div>
        </div>
    );
}

export default MainMenu;
