import { Sprite } from 'mage-engine';
import { BOULDER, TREE, getTreeSprite } from './sprites';
import { getRandomInitialEdgePositionAndDirection, getRandomPositionInGrid } from '../utils/getRandomPositions';

import {
    GRID_HEIGHT,
    GRID_WIDTH,
    getPositionFromRowAndCol,
    SPRITE_SIZE,
    SPRITE_SCALE,
    CURSOR_SCALE,
    getGridPositionFromCoordinates,
    INITIAL_TRACKS,
    areGridPositionsEqual,
    TRAIN_SCALE,
    INITIAL_CARRIAGE_POSITION,
    INITIAL_TRAIN_POSITION,
} from './grid';
import { TREE_GONE_EVENT } from './scripts/tree';
const OBSTACLE_INTERVAL = 1000;

let boulders = [];
let trees = [];

let obstaclesIntervalId;

export const addBoulder = (level) => {
    // get rid of disposed boulders from array
    boulders = boulders.filter((boulder) => boulder.scripts[0]);
    // max 5 boulders at a time
    if (boulders.length <= 5) {
        // create new boulder sprite
        const newBoulder = new Sprite(SPRITE_SIZE, SPRITE_SIZE, BOULDER);
        // get starting grid position and direction of boulder
        const {
            row,
            col,
            direction,
        } = getRandomInitialEdgePositionAndDirection();
        // get 'actual' starting position in 3D space
        const position = getPositionFromRowAndCol(
            row,
            col,
            SPRITE_SIZE,
            SPRITE_SCALE,
            true
        );

        const startingPos = { row, col };

        newBoulder.addTag(BOULDER);
        newBoulder.setPosition(position);
        newBoulder.setScale({ x: TRAIN_SCALE, y: TRAIN_SCALE });
        // start the boulder
        newBoulder.addScript(BOULDER, true, {
            startingPos,
            direction,
            tracks: level.tracks,
            level
        });
        // add the boulder to the array
        boulders.push(newBoulder);
    }
};

export const handleTreeRemoval = ({ index }) => {
    trees.splice(index, 1);
}

export const addTree = (level) => {
    const sprite = getTreeSprite();
    const tree = new Sprite(SPRITE_SIZE, SPRITE_SIZE, sprite);
    const { row, col } = getRandomPositionInGrid();

    const position = getPositionFromRowAndCol(
        row,
        col,
        SPRITE_SIZE,
        SPRITE_SCALE,
        true
    );

    tree.addTag(TREE);
    tree.setScale({x: SPRITE_SCALE, y: SPRITE_SCALE });
    tree.setPosition(position);

    const index = trees.length;

    tree.addScript(TREE, true, { tracks: level.tracks, level, index });
    tree.addEventListener(TREE_GONE_EVENT.type, handleTreeRemoval);

    trees.push(tree);
};

export const clearObstacles = () => {
    boulders.forEach(b => b.dispose());
    boulders = [];

    trees.forEach(t => t.dispose());
    trees = [];
};

export const rollForObstacle = (level) => {
    const result = Math.random();
    if (result < 0.25) {
        addBoulder(level);
    } 
    
    if (result < 0.12) {
        addTree(level);
    }
};

export const startRollingForObstacle = level => {
    obstaclesIntervalId = setInterval(() => rollForObstacle(level), OBSTACLE_INTERVAL);
}

export const stopRollingForObstacle = () => {
    clearInterval(obstaclesIntervalId);
}