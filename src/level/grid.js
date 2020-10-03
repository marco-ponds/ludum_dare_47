export const GRID_WIDTH = 18;
export const GRID_HEIGHT = 12;

export const SPRITE_SIZE = 4;
export const SPRITE_SCALE = 0.1;
export const SPRITE_DEPTH = -1.2;

export const TRAIN_SCALE = 0.08;
export const TRAIN_DEPTH = -1.1999;

export const CURSOR_SCALE = 0.12;

export const HORIZONTAL_PADDING = 1.25;
export const VERTICAL_PADDING = 1;

export const INITIAL_TRACKS = [
    { row: 1, col: 0 },
    { row: 2, col: 0 },
    { row: 3, col: 0 },
    { row: 4, col: 0 },
    { row: 5, col: 0 },
    { row: 6, col: 0 },
];

export const getPositionFromRowAndCol = (
    row,
    col,
    size = SPRITE_SIZE,
    scale = SPRITE_SCALE,
    isTrain = false
) => ({
    x: (col + size) * scale - HORIZONTAL_PADDING,
    y: VERTICAL_PADDING - (row + size) * scale,
    z: isTrain ? TRAIN_DEPTH : SPRITE_DEPTH,
});

export const getGridPositionFromCoordinates = ({ x, y }) => {
    const size = SPRITE_SIZE;
    const scale = SPRITE_SCALE;

    return {
        col: Math.floor((x + HORIZONTAL_PADDING) / scale - size),
        row: Math.ceil(-(y - VERTICAL_PADDING) / scale - size),
    };
};

export const sumGridPositions = (posA, posB) => ({
    row: posA.row + posB.row,
    col: posA.col + posB.col,
});

export const areGridPositionsEqual = (posA, posB) =>
    posA.row === posB.row && posA.col === posB.col;
