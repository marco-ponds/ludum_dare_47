import { BaseScript } from 'mage-engine';
import {
    sumGridPositions,
    getPositionFromRowAndCol,
    SPRITE_SIZE,
    TRAIN_SCALE,
    SPRITE_SCALE,
} from '../grid';
import { DIRECTIONS } from '../tracks';

export default class TrainScript extends BaseScript {
    constructor() {
        super('train_carriage');
    }

    start(trainCarriage, { trainHead }) {
        this.trainHead = trainHead;
        this.trainCarriage = trainCarriage;

        this.speed = 800;

        this.position = { row: 2, col: 3 };

        this.direction = DIRECTIONS.DOWN;
        this.trainCarriage.setRotation(
            DIRECTIONS.DOWN.orientation * (Math.PI / 180)
        );

        this.moveTrainCarriage();
    }

    calculateNewDirection(trainHead) {
        const newDirection = trainHead.scripts[0].script.oldDirection;

        if (newDirection) {
            this.direction = newDirection;
            return true;
        }

        return false;
    }

    handleFailure() {
        console.log('boom');
    }

    moveTrainCarriage() {
        const { row, col } = sumGridPositions(this.position, this.direction);
        const { orientation } = this.direction;

        const position = getPositionFromRowAndCol(
            row,
            col,
            SPRITE_SIZE,
            SPRITE_SCALE,
            true
        );

        this.trainCarriage.setRotation(orientation * (Math.PI / 180));

        this.trainCarriage.goTo(position, this.speed).then(() => {
            this.position = { row, col };
            if (this.calculateNewDirection(this.trainHead)) {
                this.moveTrainCarriage();
            } else {
                this.handleFailure();
            }
        });
    }
}
