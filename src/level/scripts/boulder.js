import { BaseScript } from 'mage-engine';
import {
    sumGridPositions,
    getPositionFromRowAndCol,
    SPRITE_SIZE,
    SPRITE_SCALE,
    isInGrid,
} from '../grid';
import { isOnTrack, DIRECTIONS } from '../tracks';

const { UP, DOWN } = DIRECTIONS;

export default class BoulderScript extends BaseScript {
    constructor() {
        super('boulder');
    }

    start(boulder, { startingPos, direction, tracks, level }) {
        this.boulder = boulder;
        this.speed = 1500;

        this.position = startingPos;
        this.direction = direction;
        this.tracks = tracks;
        this.level = level;

        this.orientation = 0;

        this.moveBoulder();
    }

    handleFailure() {
        this.boulder.dispose();
    }

    moveBoulder() {
        const { row, col } = sumGridPositions(this.position, this.direction);

        const position = getPositionFromRowAndCol(
            row,
            col,
            SPRITE_SIZE,
            SPRITE_SCALE,
            true
        );

        if (this.direction !== UP && this.direction !== DOWN) {
            this.orientation =
                this.orientation === 360 ? 0 : this.orientation + 90;
            this.boulder.setRotation(this.orientation * (Math.PI / 180));
        }

        this.boulder.goTo(position, this.speed).then(() => {
            const track = isOnTrack(position, this.tracks);
            if (track) {
                this.level.handleRemoveTrack(track);
                track.dispose();
            }
            console.log(track);
            this.position = { row, col };
            if (isInGrid(this.position)) {
                this.moveBoulder();
            } else {
                this.handleFailure();
            }
        });
    }
}
