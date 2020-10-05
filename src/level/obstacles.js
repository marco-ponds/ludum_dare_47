import { Sprite } from 'mage-engine';
import { BOULDER, TREE, getTreeSprite, FIRE } from './sprites';
import { getRandomInitialEdgePositionAndDirection, getRandomPositionInGrid, getRandomPositionNearGrid } from '../utils/getRandomPositions';

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
let fires = [];

let obstaclesIntervalId;

export const addBoulder = (level) => {
    // get rid of disposed boulders from array
    boulders = boulders.filter((boulder) => boulder.scripts[0]);
    // max 5 boulders at a time
    if (boulders.length <= 4) {
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

export const addTree = (level) => {
    trees = trees.filter((tree) => tree.scripts[0]);

    const sprite = getTreeSprite();
    const tree = new Sprite(SPRITE_SIZE, SPRITE_SIZE, sprite);
    const gridPosition = getRandomPositionInGrid();

    const position = getPositionFromRowAndCol(
        gridPosition.row,
        gridPosition.col,
        SPRITE_SIZE,
        SPRITE_SCALE,
        true
    );

    tree.addTag(TREE);
    tree.setScale({x: SPRITE_SCALE, y: SPRITE_SCALE });
    tree.setPosition(position);

    const index = trees.length;

    tree.addScript(TREE, true, { tracks: level.tracks, level, index, position: gridPosition });

    trees.push(tree);
};

const findFirePosition = (gridPosition) => {
    let tries = 0;

    while (tries < 10) {
        const newPosition = getRandomPositionNearGrid(gridPosition);

        if (!fires.filter(fire => areGridPositionsEqual(fire.gridPosition, newPosition)).length) {
            return newPosition;
        }

        tries++;
    }

    return null;
}

export const addFire = (level, fromPosition) => {
    fires = fires.filter(fire => fire.scripts[0]);

    const fire = new Sprite(SPRITE_SIZE, SPRITE_SIZE, FIRE);
    let position, gridPosition;

    if (fromPosition) {
        gridPosition = findFirePosition(fromPosition);
        if (!gridPosition) {
            fire.dispose();
            return;
        }
    } else {
        gridPosition = getRandomPositionInGrid();
    }

    position = getPositionFromRowAndCol(
        gridPosition.row,
        gridPosition.col,
        SPRITE_SIZE,
        SPRITE_SCALE,
        true
    );

    fire.gridPosition = gridPosition;
    fire.addTag(FIRE);
    fire.setScale({x: SPRITE_SCALE, y: SPRITE_SCALE });
    fire.setPosition(position);

    fire.addScript(FIRE, true, { tracks: level.tracks, level, position: gridPosition, addFire});

    fires.push(fire);
}

export const clearObstacles = () => {
    boulders.forEach(b => b.dispose());
    boulders = [];

    trees.forEach(t => t.dispose());
    trees = [];

    fires.forEach(fire => fire.dispose());
    fires = [];
};

export const rollForObstacle = (level) => {
    const result = Math.random();
    if (result < 0.25) {
        addBoulder(level);
    } 
    
    if (result < 0.12) {
        addTree(level);
    }

    if (result < 0.08) {
        addFire(level);
    }
};

export const startRollingForObstacle = level => {
    obstaclesIntervalId = setInterval(() => rollForObstacle(level), OBSTACLE_INTERVAL);
}

export const stopRollingForObstacle = () => {
    clearInterval(obstaclesIntervalId);
}