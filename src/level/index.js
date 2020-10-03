import { Level, Sprite, Scene, Scripts } from 'mage-engine';
import { GRID_HEIGHT, GRID_WIDTH, getPositionFromRowAndCol, SPRITE_SIZE, SPRITE_SCALE, CURSOR_SCALE } from './grid';
import { DIRT, GRASS, getGrassSprite, CURSOR } from './sprites';
import CursorScript from './cursorScript';

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

    addCursor() {
        const cursor = new Sprite(SPRITE_SIZE, SPRITE_SIZE, CURSOR);
        const position = getPositionFromRowAndCol(0, 0, SPRITE_SIZE, CURSOR_SCALE);

        cursor.setScale({x: CURSOR_SCALE, y: CURSOR_SCALE });
        cursor.setPosition(position);
        cursor.addScript(CURSOR);
    }

    buildLevel() {
        for (let row = 0; row < GRID_HEIGHT; row++) {
            for (let col = 0; col < GRID_WIDTH; col++) {
                const position = getPositionFromRowAndCol(row, col, SPRITE_SIZE, SPRITE_SCALE);
                
                const dirt = new Sprite(SPRITE_SIZE, SPRITE_SIZE, DIRT);
                const grass = new Sprite(SPRITE_SIZE, SPRITE_SIZE, getGrassSprite());

                dirt.addTags(['background', 'dirt']);
                grass.addTags(['background', 'grass']);

                dirt.setOpacity(0.5);
                grass.setOpacity(0.7);

                dirt.setScale({ x: SPRITE_SCALE, y: SPRITE_SCALE });
                dirt.setPosition(position);

                grass.setScale({ x: SPRITE_SCALE, y: SPRITE_SCALE });
                grass.setPosition(position);
            }
        }
    };

    onCreate() {
        Scene.setClearColor(BACKGROUND);
        Scripts.create(CURSOR, CursorScript);

        this.buildLevel();
        this.addCursor();
    }
}