import { BaseScript } from 'mage-engine';
import {
    sumGridPositions,
    getPositionFromRowAndCol,
    SPRITE_SIZE,
    SPRITE_SCALE,
    isInGrid,
} from '../grid';
import { isOnTrack, DIRECTIONS } from '../tracks';
import { randomIntegerInRange } from '../../utils/randomIntegerInRange';


export const TREE_GONE_EVENT = {
    type: 'treeGone'
};

export default class TreeScript extends BaseScript {
    
    constructor() {
        super('tree');
    }

    start(tree, { tracks, level, position, index }) {
        this.tree = tree;

        this.position = position;
        this.tracks = tracks;
        this.level = level;

        this.timeToDecay = randomIntegerInRange(4000, 10000);

        const track = isOnTrack(position, this.level.tracks, false);
        if (track) {
            this.level.handleRemoveTrack(track);
        }

        setTimeout(() => this.removeTree(index), this.timeToDecay);
    }

    removeTree(index) {
        this.tree.dispose();
    }
}
