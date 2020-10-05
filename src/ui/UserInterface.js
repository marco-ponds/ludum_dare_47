import { Component } from 'inferno';
import MainMenu from './MainMenu';
import GameInterface from './GameInterface';
import GameOver from './GameOver';
import { GAME_OVER_EVENT, GAME_RETRY_EVENT, GAME_SCORE_EVENT, TOOLBAR_SELECTION_CHANGE_EVENT } from '../level';
import { VERTICAL } from '../level/tracks';

class UserInterface extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            gameState: 'menu',
            over: false,
            score: 0,
            toolbarSelection: VERTICAL
        };
    }

    componentDidMount() {
        const { scene } = this.props;

        scene.addEventListener(GAME_OVER_EVENT.type, this.handleGameOver);
        scene.addEventListener(GAME_RETRY_EVENT.type, this.handleGameRetry);
        scene.addEventListener(GAME_SCORE_EVENT.type, this.handleScore);
        scene.addEventListener(TOOLBAR_SELECTION_CHANGE_EVENT.type, this.handleToolbarSelectionEvent);
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
        this.setState({
            gameState: 'inGame',
            over: false,
            score: 0,
            toolbarSelection: VERTICAL
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

    handleToolbarSelectionEvent = ({ toolbarSelection }) => {
        this.handleToolbarSelection(toolbarSelection);
    }

    handleToolbarSelection = (toolbarSelection) => {
        this.setState({
            toolbarSelection
        });

        this.props.scene.handleToolbarSelection(toolbarSelection);
    }

    getGameInterface = () => (
        <GameInterface
            onRetry={this.props.scene.handleRetry}
            onToolbarSelection={this.handleToolbarSelection}
            onComponentDidMount={this.props.scene.startGame}
            toolbarSelection={this.state.toolbarSelection}
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
