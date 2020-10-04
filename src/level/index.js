import { Level, Sprite, Scene, Scripts, Audio } from 'mage-engine';
import { getRandomInitialEdgePositionAndDirection } from '../utils/getRandomInitialEdgePositionAndDirection';
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
    INITIAL_CARRIAGE_POSITION,
    INITIAL_TRAIN_POSITION,
} from './grid';
import {
    DIRT,
    getGrassSprite,
    CURSOR,
    TRACK,
    TRAIN_HEAD,
    TRAIN,
    TRAIN_CARRIAGE,
    BOULDER,
} from './sprites';
import CursorScript, {
    PLACE_TRACK_EVENT,
    TRACK_CLICK_EVENT,
} from './scripts/cursor';
import TrainScript, { TRACK_CHANGE_EVENT } from './scripts/train';
import CarriageScript from './scripts/carriage';
import BoulderScript from './scripts/boulder';

import { VERTICAL, getNextRotation, TRACK_TYPES_TO_SPRITE_MAP } from './tracks';
import UserInterface from '../ui/UserInterface';

const BACKGROUND = 0xe3dbcc;//0x2f3640;
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
            INITIAL_TRAIN_POSITION.row,
            INITIAL_TRAIN_POSITION.col,
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
            INITIAL_CARRIAGE_POSITION.row,
            INITIAL_CARRIAGE_POSITION.col,
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

    addBoulder() {
        // get rid of disposed boulders from array
        this.boulders = this.boulders.filter((boulder) => boulder.scripts[0]);
        // max 5 boulders at a time
        if (this.boulders.length <= 5) {
            // create new boulder sprite
            const newBoulder = new Sprite(SPRITE_SIZE, SPRITE_SIZE, BOULDER);
            // get starting grid position and direction of boulder
            const {
                row,
                col,
                direction,
            } = getRandomInitialEdgePositionAndDirection();
            // get 'actual' starting position in 3D space
            const position = getPositionFromRowAndCol(
                row,
                col,
                SPRITE_SIZE,
                SPRITE_SCALE,
                true
            );

            const startingPos = { row, col };

            newBoulder.addTag(BOULDER);
            newBoulder.setPosition(position);
            newBoulder.setScale({ x: TRAIN_SCALE, y: TRAIN_SCALE });
            // start the boulder
            newBoulder.addScript(BOULDER, true, {
                startingPos,
                direction,
                tracks: this.tracks,
                level: this,
            });
            // add the boulder to the array
            this.boulders.push(newBoulder);
        }
    }

    rollForObstacle = () => {
        const result = Math.random();
        if (result < 0.3) {
            this.addBoulder();
        }
    };

    handlePlaceTrack = (event) => {
        const { position } = event;

        this.tracks.push(this.createTrackAtPosition(position));

        this.trainHead.dispatchEvent({
            ...TRACK_CHANGE_EVENT,
            tracks: this.tracks,
        });
    };

    handleRemoveTrack = (removedTrack) => {
        const { gridPosition } = removedTrack;
        this.tracks = this.tracks.filter(
            (track) => track.gridPosition !== gridPosition
        );
        this.trainHead.dispatchEvent({
            ...TRACK_CHANGE_EVENT,
            tracks: this.tracks,
        });
    };

    handleTrackClick = (event) => {
        //const nextRotation = getNextRotation(event.track);
        const index = this.tracks.findIndex((track) =>
            areGridPositionsEqual(track.gridPosition, event.track.gridPosition)
        );

        this.tracks[index].type = this.toolbarSelection;
        this.tracks[index].setTextureMap(
            TRACK_TYPES_TO_SPRITE_MAP[this.toolbarSelection]
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
        this.boulders = [];
        this.obstacleInterval = setInterval(this.rollForObstacle, 1000);
        this.addTrain();
        //this.addTrainCarriage();
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
        Audio.setVolume(2);
        //Scene.setClearColor(BACKGROUND);
        Scripts.create(CURSOR, CursorScript);
        Scripts.create(TRAIN, TrainScript);
        Scripts.create(TRAIN_CARRIAGE, CarriageScript);
        Scripts.create(BOULDER, BoulderScript);

        this.tracks = [];
        this.toolbarSelection = VERTICAL;

        window.tracks = this.tracks;

        this.enableUI(UserInterface);
    }

    onBeforeDispose() {
        clearInterval(this.obstacleInterval);
    }
}
