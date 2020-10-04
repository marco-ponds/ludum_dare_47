import { Level, Sprite, Scene, Scripts } from 'mage-engine';
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
} from './grid';
import {
    DIRT,
    getGrassSprite,
    CURSOR,
    TRACK,
    TRAIN_HEAD,
    TRAIN,
    TRAIN_CARRIAGE,
} from './sprites';
import CursorScript, {
    PLACE_TRACK_EVENT,
    TRACK_CLICK_EVENT,
} from './scripts/cursor';
import TrainScript, { TRACK_CHANGE_EVENT } from './scripts/train';
import CarriageScript from './scripts/carriage';
import { VERTICAL, getNextRotation, TRACK_TYPES_TO_SPRITE_MAP } from './tracks';
import UserInterface from '../ui/UserInterface';

const BACKGROUND = 0x2f3640;
const WHITE = 0xffffff;

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
        const position = getPositionFromRowAndCol(
            0,
            0,
            SPRITE_SIZE,
            SPRITE_SCALE,
            false,
            true
        );

        cursor.setScale({ x: CURSOR_SCALE, y: CURSOR_SCALE });
        cursor.addTag(CURSOR);
        cursor.setPosition(position);
        cursor.addScript(CURSOR);

        cursor.addEventListener(PLACE_TRACK_EVENT.type, this.handlePlaceTrack);
        cursor.addEventListener(TRACK_CLICK_EVENT.type, this.handleTrackClick);
    }

    addTrain() {
        this.trainHead = new Sprite(SPRITE_SIZE, SPRITE_SIZE, TRAIN_HEAD);
        const position = getPositionFromRowAndCol(
            3,
            3,
            SPRITE_SIZE,
            SPRITE_SCALE,
            true
        );

        this.trainHead.setScale({ x: TRAIN_SCALE, y: TRAIN_SCALE });
        this.trainHead.addTag(TRAIN_HEAD);
        this.trainHead.setPosition(position);

        this.trainHead.addScript(TRAIN, true, { tracks: this.tracks });
    }

    addTrainCarriage() {
        this.trainCarriage = new Sprite(
            SPRITE_SIZE,
            SPRITE_SIZE,
            TRAIN_CARRIAGE
        );
        const position = getPositionFromRowAndCol(
            2,
            3,
            SPRITE_SIZE,
            SPRITE_SCALE,
            true
        );

        this.trainCarriage.setScale({ x: TRAIN_SCALE, y: TRAIN_SCALE });
        this.trainCarriage.addTag(TRAIN_CARRIAGE);
        this.trainCarriage.setPosition(position);

        this.trainCarriage.addScript(TRAIN_CARRIAGE, true, {
            trainHead: this.trainHead,
        });
    }

    handlePlaceTrack = (event) => {
        const { position } = event;

        this.tracks.push(this.createTrackAtPosition(position));

        this.trainHead.dispatchEvent({
            ...TRACK_CHANGE_EVENT,
            tracks: this.tracks,
        });
    };

    handleTrackClick = (event) => {
        const nextRotation = getNextRotation(event.track);
        const index = this.tracks.findIndex((track) =>
            areGridPositionsEqual(track.gridPosition, event.track.gridPosition)
        );

        this.tracks[index].type = nextRotation;
        this.tracks[index].setTextureMap(
            TRACK_TYPES_TO_SPRITE_MAP[nextRotation]
        );

        this.trainHead.dispatchEvent({
            ...TRACK_CHANGE_EVENT,
            tracks: this.tracks,
        });
    };

    handleToolbarSelection = (selection) => {
        this.toolbarSelection = selection;
    };

    createTrackAtPosition(position, type) {
        const trackType = type ? type : this.toolbarSelection;
        const sprite = TRACK_TYPES_TO_SPRITE_MAP[trackType];
        const track = new Sprite(SPRITE_SIZE, SPRITE_SIZE, sprite);

        track.setScale({ x: SPRITE_SCALE, y: SPRITE_SCALE });
        track.addTags([TRACK]);
        track.setPosition(position);
        track.setColor(WHITE);

        track.setOpacity(0.8);

        track.type = trackType;
        track.gridPosition = getGridPositionFromCoordinates(position);

        return track;
    }

    buildLevel() {
        for (let row = 0; row < GRID_HEIGHT; row++) {
            for (let col = 0; col < GRID_WIDTH; col++) {
                const position = getPositionFromRowAndCol(
                    row,
                    col,
                    SPRITE_SIZE,
                    SPRITE_SCALE
                );

                const dirt = new Sprite(SPRITE_SIZE, SPRITE_SIZE, DIRT);
                const grass = new Sprite(
                    SPRITE_SIZE,
                    SPRITE_SIZE,
                    getGrassSprite()
                );

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
    }

    startGame = () => {
        this.buildLevel();
        this.buildInitialtracks();

        this.addTrain();
        this.addTrainCarriage();
        this.addCursor();
    };

    buildInitialtracks() {
        for (let trackPosition of INITIAL_TRACKS) {
            const { row, col, type } = trackPosition;
            const position = getPositionFromRowAndCol(row, col);

            this.tracks.push(this.createTrackAtPosition(position, type));
        }
    }

    onCreate() {
        Scene.setClearColor(BACKGROUND);
        Scripts.create(CURSOR, CursorScript);
        Scripts.create(TRAIN, TrainScript);
        Scripts.create(TRAIN_CARRIAGE, CarriageScript);

        this.tracks = [];
        this.toolbarSelection = VERTICAL;

        this.enableUI(UserInterface);
    }
}
