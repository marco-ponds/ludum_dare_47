import { BaseScript } from 'mage-engine';
import {
    sumGridPositions,
    getPositionFromRowAndCol,
    SPRITE_SIZE,
    SPRITE_SCALE,
} from '../grid';
import {
    convertTrackTypeToNewDirection,
    isOnTrack,
    DIRECTIONS,
} from '../tracks';
import { stopEngineSound, playCrashSound } from '../sounds';

export const TRACK_CHANGE_EVENT = {
    type: 'newTrack',
};

export default class TrainScript extends BaseScript {
    constructor() {
        super('train');
    }

    start(train, { tracks, level }) {
        this.tracks = tracks;
        this.train = train;
        this.level = level;

        this.speed = 1500;

        this.position = { row: 3, col: 3 };
        this.oldDirection = DIRECTIONS.DOWN;
        this.direction = DIRECTIONS.DOWN;

        this.train.setRotation(DIRECTIONS.DOWN.orientation * (Math.PI / 180));

        this.moveTrain();
    }

    calculateNewDirection(track) {
        const newDirection = convertTrackTypeToNewDirection(
            track,
            this.direction
        );

        if (newDirection) {
            this.oldDirection = this.direction;
            this.direction = newDirection;
            return true;
        } else {
            this.direction = null;
            this.oldDirection = null;
        }

        return false;
    }

    handleFailure() {
        this.oldDirection = null;
        this.level.handleFailure();
    }

    moveTrain() {
        const { row, col } = sumGridPositions(this.position, this.direction);
        const { orientation } = this.direction;

        const position = getPositionFromRowAndCol(
            row,
            col,
            SPRITE_SIZE,
            SPRITE_SCALE,
            true
        );

        this.train.setRotation(orientation * (Math.PI / 180));

        this.train.goTo(position, this.speed).then(() => {
            const track = isOnTrack(position, this.level.tracks);

            if (track) {
                this.position = { row, col };
                if (this.calculateNewDirection(track)) {
                    this.level.updateScore(track);
                    this.level.deteriorateTrack(track);
                    
                    this.moveTrain();
                } else {
                    this.handleFailure();
                }
            } else {
                this.handleFailure();
            }
        });
    }
}
