import { playStartSound } from '../../level/sounds';
import InstructionDetails from './InstructionDetails';

const MainMenu = ({ onStart }) => {
    const handleClick = () => {
        playStartSound();
        onStart();
    };

    return (
        <div className="main-menu fancy-text">
            <div className="menu-container box">
                <h1 className="game-title">Ferrovia Folle</h1>
                <h2 className="game-subtitle">(Crazy Railway)</h2>
                <div className="game-instructions">
                    <p>
                        Choo, choo! The train is moving, and it's your job to
                        keep it that way!
                    </p>
                    <InstructionDetails />
                </div>
                <button className="button" onClick={handleClick}>
                    Start
                </button>
            </div>
        </div>
    );
};

export default MainMenu;
