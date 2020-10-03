import { BaseScript } from 'mage-engine';
import { sumGridPositions, getPositionFromRowAndCol, getGridPositionFromCoordinates, areGridPositionsEqual, SPRITE_SIZE, TRAIN_SCALE, SPRITE_SCALE } from '../grid';
import { convertTrackTypeToNewDirection, DIRECTIONS } from '../tracks';

export const TRACK_CHANGE_EVENT = {
    type: 'newTrack'
};

export default class TrainScript extends BaseScript {

    constructor() {
        super('train');
    }

    start(train, { tracks }) {
        this.tracks = tracks;
        this.train = train;

        this.speed = 1000;

        this.position = { row: 0, col: 0 };
        this.direction = DIRECTIONS.DOWN;

        this.train.addEventListener(TRACK_CHANGE_EVENT.type, this.handleTrackChange);


        this.moveTrain();
    }

    isOnTrack(position) {
        const gridPosition = getGridPositionFromCoordinates(position);
        const track = this.tracks.filter(track => areGridPositionsEqual(track.gridPosition, gridPosition)).pop();

        return track;
    }

    calculateNewDirection(track) {
        const newDirection = convertTrackTypeToNewDirection(track, this.direction);

        console.log('newdir', track.type, newDirection);

        if (newDirection) {
            this.direction = newDirection;
            return true;
        }

        return false;
    }

    handleTrackChange({ tracks }) {
        this.tracks = tracks;
    }

    handleFailure() {
        console.log('boom');
    }

    moveTrain() {
        const { row, col } = sumGridPositions(this.position, this.direction);
        const position = getPositionFromRowAndCol(row, col, SPRITE_SIZE, SPRITE_SCALE, true);
        this.train
            .goTo(position, this.speed)
            .then(() => {
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