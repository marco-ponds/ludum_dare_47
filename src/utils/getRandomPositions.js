import { GRID_HEIGHT, GRID_WIDTH } from '../level/grid';
import { randomIntegerInRange } from './randomIntegerInRange';
import { DIRECTIONS } from '../level/tracks';

const { UP, DOWN, LEFT, RIGHT } = DIRECTIONS;

export const getRandomInitialEdgePositionAndDirection = () => {
    const isGoingAcross = Math.random() > 0.5;
    const isPositiveDirection = Math.random() > 0.5;

    let rowColDirection;
    if (isGoingAcross && isPositiveDirection) {
        rowColDirection = {
            row: randomIntegerInRange(0, GRID_HEIGHT),
            col: 1,
            direction: RIGHT,
        };
    } else if (isGoingAcross && !isPositiveDirection) {
        rowColDirection = {
            row: randomIntegerInRange(0, GRID_HEIGHT),
            col: GRID_WIDTH,
            direction: LEFT,
        };
    } else if (!isGoingAcross && isPositiveDirection) {
        rowColDirection = {
            row: 1,
            col: randomIntegerInRange(0, GRID_WIDTH),
            direction: DOWN,
        };
    } else {
        rowColDirection = {
            row: GRID_HEIGHT,
            col: randomIntegerInRange(0, GRID_WIDTH),
            direction: UP,
        };
    }
    return rowColDirection;
};

export const getRandomPositionInGrid = () => ({
    row: randomIntegerInRange(0, GRID_HEIGHT - 1),
    col: randomIntegerInRange(0, GRID_WIDTH - 1)
});