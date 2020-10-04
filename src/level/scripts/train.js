import { BaseScript } from 'mage-engine';
import {
    sumGridPositions,
    getPositionFromRowAndCol,
    getGridPositionFromCoordinates,
    areGridPositionsEqual,
    SPRITE_SIZE,
    TRAIN_SCALE,
    SPRITE_SCALE,
} from '../grid';
import { convertTrackTypeToNewDirection, DIRECTIONS } from '../tracks';

export const TRACK_CHANGE_EVENT = {
    type: 'newTrack',
};

export default class TrainScript extends BaseScript {
    constructor() {
        super('train');
    }

    start(train, { tracks }) {
        this.tracks = tracks;
        this.train = train;

        this.speed = 800;

        this.position = { row: 3, col: 3 };
        this.oldDirection = DIRECTIONS.DOWN;
        this.direction = DIRECTIONS.DOWN;

        this.train.setRotation(DIRECTIONS.DOWN.orientation * (Math.PI / 180));

        this.train.addEventListener(
            TRACK_CHANGE_EVENT.type,
            this.handleTrackChange
        );

        this.moveTrain();
    }

    isOnTrack(position) {
        const gridPosition = getGridPositionFromCoordinates(position);
        const track = this.tracks
            .filter((track) =>
                areGridPositionsEqual(track.gridPosition, gridPosition)
            )
            .pop();

        return track;
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

    handleTrackChange({ tracks }) {
        this.tracks = tracks;
    }

    handleFailure() {
        this.oldDirection = null;
        console.log('boom');
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
            const track = this.isOnTrack(position);

            if (track) {
                this.position = { row, col };
                if (this.calculateNewDirection(track)) {
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
