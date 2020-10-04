import { Component } from 'inferno';
import MainMenu from './MainMenu';
import GameInterface from './GameInterface';
import GameOver from './GameOver';
import { GAME_OVER_EVENT, GAME_RETRY_EVENT, GAME_SCORE_EVENT } from '../level';

class UserInterface extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            gameState: 'menu',
            over: false,
            score: 0
        };
    }

    componentDidMount() {
        const { scene } = this.props;

        scene.addEventListener(GAME_OVER_EVENT.type, this.handleGameOver);
        scene.addEventListener(GAME_RETRY_EVENT.type, this.handleGameRetry);
        scene.addEventListener(GAME_SCORE_EVENT.type, this.handleScore);
    }

    handleScore = ({ score }) => {
        this.setState({
            score
        });
    }

    handleGameOver = () => {
        this.setState({
            over: true
        });
    }

    handleGameRetry = () => {
        console.log('received retry');
        this.setState({
            gameState: 'inGame',
            over: false,
            score: 0
        });
    }

    getMainMenu = () => (
        <MainMenu
            onStart={() =>
                this.setState(() => ({
                    gameState: 'inGame',
                }))
            }
        />
    );

    getGameInterface = () => (
        <GameInterface
            onRetry={this.props.scene.handleRetry}
            onToolbarSelection={this.props.scene.handleToolbarSelection}
            onComponentDidMount={this.props.scene.startGame}
            score={this.state.score}
            isOver={this.state.over}
        />
    );

    render() {
        return this.state.gameState === 'menu' ?
            this.getMainMenu() :
            this.getGameInterface();
    }
}

export default UserInterface;
