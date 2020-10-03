export const GRID_WIDTH = 18;
export const GRID_HEIGHT = 12;

export const SPRITE_SIZE = 4;
export const SPRITE_SCALE = 0.1;
export const SPRITE_DEPTH = -1.2;

export const HORIZONTAL_PADDING = 1.25;
export const VERTICAL_PADDING = 1;

export const getPositionFromRowAndCol = (row, col, size = SPRITE_SIZE, scale) => ({
    x: (col + size) * scale - HORIZONTAL_PADDING,
    y: VERTICAL_PADDING - (row + size) * scale,
    z: SPRITE_DEPTH
});