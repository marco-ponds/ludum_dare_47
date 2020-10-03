import { Level, Sprite, Scene } from 'mage-engine';
import { GRID_HEIGHT, GRID_WIDTH, getPositionFromRowAndCol, SPRITE_SIZE, SPRITE_SCALE } from './grid';

const BACKGROUND = 0x2f3640;

export default class Intro extends Level {

    progressAnimation = (callback) => {
        const loader = document.querySelector('.loader');
        loader.classList.remove('fadeout', 'invisible');
        setTimeout(() => {
            loader.classList.add('fadeout');
            callback();
        }, 1000);
        setTimeout(() => {
            loader.classList.add('invisible');
        }, 2000);
    };

    buildLevel() {
        for (let row = 0; row < GRID_HEIGHT; row++) {
            for (let col = 0; col < GRID_WIDTH; col++) {
                const position = getPositionFromRowAndCol(row, col, SPRITE_SIZE, SPRITE_SCALE);
                const sprite = new Sprite(SPRITE_SIZE, SPRITE_SIZE, 'train_carriage');

                sprite.setScale({ x: SPRITE_SCALE, y: SPRITE_SCALE });
                sprite.setPosition(position);
            }
        }
    };

    onCreate() {
        Scene.setClearColor(BACKGROUND);
        this.buildLevel();
    }
}