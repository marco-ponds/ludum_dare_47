import { BaseScript, Sprite } from 'mage-engine';
import {
    sumGridPositions,
    getPositionFromRowAndCol,
    SPRITE_SIZE,
    SPRITE_SCALE,
    isInGrid,
} from '../grid';
import { isOnTrack, DIRECTIONS } from '../tracks';
import { randomIntegerInRange } from '../../utils/randomIntegerInRange';
import { FIRE } from '../sprites';

export default class FireScript extends BaseScript {
    
    constructor() {
        super('fire');
    }

    start(fire, { tracks, level, position, addFire }) {
        this.fire = fire;

        this.position = position;
        this.tracks = tracks;
        this.level = level;

        this.timeToDecay = randomIntegerInRange(1000, 2000);
        this.fireSpreadCheck = randomIntegerInRange(100, 200);

        this.maxFires = 2;
        this.firesSpawned = 0;

        this.interval = setInterval(() => {
            if (Math.random() < 0.2) {
                addFire(level, position);
                clearInterval(this.interval);
            }
        }, this.fireSpreadCheck);

        const track = isOnTrack(position, this.level.tracks, false);
        if (track) {
            this.level.handleRemoveTrack(track);
        }

        setTimeout(this.removeFire, this.timeToDecay);
    }

    removeFire = () => {
        console.log('fire is dead');
        clearInterval(this.interval);
        this.fire.dispose();
    }
}
