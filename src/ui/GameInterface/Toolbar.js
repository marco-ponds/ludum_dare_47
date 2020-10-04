import ToolbarItem from "./ToolbarItem";
import { VERTICAL, HORIZONTAL, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT } from "../../level/tracks";
import { Component } from "inferno";
import { Sound } from "mage-engine";

const TYPES = [VERTICAL, HORIZONTAL, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT];

const playClickSound = () => {
    const sound = new Sound('click');

    sound.start();
}

class Toolbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selection: VERTICAL
        };

        this.handleSelection = this.handleSelection.bind(this);
    }

    handleSelection(type) {
        const { onToolbarSelection } = this.props;
        this.setState({ selection: type });

        // play sound
        playClickSound();

        onToolbarSelection(type);
    };

    mapTypesToToolbarItem = () => {
        return TYPES.map(type => (
            <ToolbarItem
                isSelected={this.state.selection === type}
                type={type}
                onClick={() => this.handleSelection(type)}/>
        ));
    }

    render() {
        return (
            <div className='toolbar'>
                <ul className='toolbar-container'>
                    { this.mapTypesToToolbarItem() }
                </ul>
            </div>
        )
    }
}

export default Toolbar;