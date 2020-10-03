export const DIRECTIONS = {
    UP: { row: -1, col: 0, type: 'UP' },
    LEFT: { row: 0, col: -1, type: 'LEFT' },
    DOWN: { row: 1, col: 0, type: 'DOWN' },
    RIGHT: { row: 0, col: 1, type: 'RIGHT' }
};

export const VERTICAL = 'VERTICAL';
export const HORIZONTAL = 'HORIZONTAL';
export const HORIZONTAL2 = 'HORIZONTAL2';
export const TOP_LEFT = 'TOP_LEFT';
export const TOP_RIGHT = 'TOP_RIGHT';
export const BOTTOM_LEFT = 'BOTTOM_LEFT';
export const BOTTOM_RIGHT = 'BOTTOM_RIGHT';

export const TRACK_VERTICAL = 'track_vertical';
export const TRACK_HORIZONTAL = 'track_horizontal';
export const TRACK_TOP_LEFT = 'track_top_left';
export const TRACK_TOP_RIGHT = 'track_top_right';
export const TRACK_BOTTOM_LEFT = 'track_bottom_left';
export const TRACK_BOTTOM_RIGHT = 'track_bottom_right';

export const TRACK_TYPES_TO_SPRITE_MAP = {
    TOP_RIGHT: TRACK_TOP_RIGHT,
    TOP_LEFT: TRACK_TOP_LEFT,
    BOTTOM_LEFT: TRACK_BOTTOM_LEFT,
    BOTTOM_RIGHT: TRACK_BOTTOM_RIGHT,
    VERTICAL: TRACK_VERTICAL,
    HORIZONTAL: TRACK_HORIZONTAL,
    HORIZONTAL2: TRACK_HORIZONTAL,
};

export const TRACK_TYPES_MAP = {
    TOP_RIGHT: {
        LEFT: DIRECTIONS.DOWN,
        UP: DIRECTIONS.RIGHT
    },
    TOP_LEFT: {
        RIGHT: DIRECTIONS.DOWN,
        UP: DIRECTIONS.LEFT
    },
    BOTTOM_LEFT: {
        RIGHT: DIRECTIONS.UP,
        DOWN: DIRECTIONS.LEFT
    },
    BOTTOM_RIGHT: {
        LEFT: DIRECTIONS.UP,
        DOWN: DIRECTIONS.RIGHT
    },
    VERTICAL: {
        DOWN: DIRECTIONS.DOWN,
        UP: DIRECTIONS.UP
    },
    HORIZONTAL: {
        LEFT: DIRECTIONS.LEFT,
        RIGHT: DIRECTIONS.RIGHT
    },
    HORIZONTAL2: {
        LEFT: DIRECTIONS.LEFT,
        RIGHT: DIRECTIONS.RIGHT
    }
};

export const TRACKS_ROTATION = [VERTICAL, TOP_RIGHT, HORIZONTAL, BOTTOM_RIGHT, BOTTOM_LEFT, HORIZONTAL2, TOP_LEFT];

export const convertTrackTypeToNewDirection = (track, direction) => {
    const trackType = TRACK_TYPES_MAP[track.type];
    
    return trackType ? trackType[direction.type] : null;
};

export const getNextRotation = (track) => {
    const index = TRACKS_ROTATION.indexOf(track.type);

    return (index === TRACKS_ROTATION.length - 1) ? TRACKS_ROTATION[0] : TRACKS_ROTATION[index+1];
};