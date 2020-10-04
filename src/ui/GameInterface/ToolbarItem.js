import { TRACK_TYPES_TO_SPRITE_MAP } from "../../level/tracks"

const ToolbarItem = ({ type, isSelected = false, onClick }) => {
    const texture = TRACK_TYPES_TO_SPRITE_MAP[type];
    const classname = isSelected ? 'toolbar-item selected' : 'toolbar-item';
    
    return (
        <li
            onClick={onClick}
            className={classname}>
            <img src={`assets/textures/${texture}.png`} />
        </li>
    )
};

export default ToolbarItem;