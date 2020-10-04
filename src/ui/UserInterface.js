import { Component } from 'inferno';
import MainMenu from './MainMenu';
import GameInterface from './GameInterface';
import GameOver from './GameOver';

class UserInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameState: 'menu',
        };
    }

    render() {
        let component;
        switch (this.state.gameState) {
            case 'menu':
                component = (
                    <MainMenu
                        onStart={() =>
                            this.setState(() => ({
                                gameState: 'inGame',
                            }))
                        }
                    />
                );
                break;
            case 'inGame':
                component = (
                    <GameInterface
                        onToolbarSelection={this.props.scene.handleToolbarSelection}
                        onComponentDidMount={this.props.scene.startGame}
                    />
                );
                break;
            case 'gameOver':
                component = <GameOver />;
                break;
        }
        return component;
    }
}

export default UserInterface;
