import { VERTICAL, BOTTOM_RIGHT, HORIZONTAL, BOTTOM_LEFT, TOP_LEFT, TOP_RIGHT } from './tracks';

export const GRID_WIDTH = 18;
export const GRID_HEIGHT = 12;

export const SPRITE_SIZE = 4;
export const SPRITE_SCALE = 0.1;
export const SPRITE_DEPTH = -1.2;

export const TRAIN_SCALE = 0.1;
export const TRAIN_DEPTH = -1.19999;

export const CURSOR_SCALE = 0.12;
export const CURSOR_DEPTH = -1.1999;

export const HORIZONTAL_PADDING = 1.25;
export const VERTICAL_PADDING = 1;

export const INITIAL_TRACKS = [
    { row: 4, col: 3, type: VERTICAL },
    { row: 5, col: 3, type: VERTICAL },
    { row: 6, col: 3, type: VERTICAL },
    { row: 7, col: 3, type: BOTTOM_RIGHT },
    { row: 7, col: 4, type: HORIZONTAL },
    { row: 7, col: 5, type: HORIZONTAL },
    { row: 7, col: 6, type: BOTTOM_LEFT },
    { row: 6, col: 6, type: VERTICAL },
    { row: 5, col: 6, type: VERTICAL },
    { row: 4, col: 6, type: VERTICAL },
    { row: 3, col: 6, type: TOP_LEFT },
    { row: 3, col: 5, type: HORIZONTAL },
    { row: 3, col: 4, type: HORIZONTAL },
    { row: 3, col: 3, type: TOP_RIGHT },
];

export const INITIAL_CARRIAGE_POSITION = { row: 4, col: 3 };
export const INITIAL_TRAIN_POSITION = { row: 5, col: 3 };

export const getPositionFromRowAndCol = (
    row,
    col,
    size = SPRITE_SIZE,
    scale = SPRITE_SCALE,
    isTrain = false,
    isCursor = false
) => ({
    x: (col + size) * scale - HORIZONTAL_PADDING,
    y: VERTICAL_PADDING - (row + size) * scale,
    z: isTrain ? TRAIN_DEPTH : isCursor ? CURSOR_DEPTH : SPRITE_DEPTH,
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

export const isInGrid = ({ row, col }) =>
    row >= 0 && row <= GRID_HEIGHT && col >= 0 && col <= GRID_WIDTH;
