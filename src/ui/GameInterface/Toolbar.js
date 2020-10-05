import ToolbarItem from "./ToolbarItem";
import { VERTICAL, HORIZONTAL, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT } from "../../level/tracks";
import { Component } from "inferno";
import { playClickSound } from "../../level/sounds";
import { parseScore } from "../../utils/parseScore";

const TYPES = [VERTICAL, HORIZONTAL, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT];

const Score = ({ score }) => {
    return <li className='score'>
        <p>{parseScore(score)}</p>
    </li>
}

class Toolbar extends Component {

    constructor(props) {
        super(props);

        this.handleSelection = this.handleSelection.bind(this);
    }

    handleSelection(type) {
        const { onToolbarSelection } = this.props;

        playClickSound();
        onToolbarSelection(type);
    };

    mapTypesToToolbarItem = () => {
        return TYPES.map(type => (
            <ToolbarItem
                isSelected={this.props.toolbarSelection === type}
                type={type}
                onClick={() => this.handleSelection(type)}/>
        ));
    }

    render() {
        return (
            <div className='toolbar'>
                <ul className='toolbar-container'>
                    <Score score={this.props.score} />
                    { this.mapTypesToToolbarItem() }
                </ul>
            </div>
        )
    }
}

export default Toolbar;