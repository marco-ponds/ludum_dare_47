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

import { VERTICAL, getNextRotation, TRACK_TYPES_TO_SPRITE_MAP, MAX_TRACK_LIFE, HORIZONTAL, transformTrackLifeToOpacity } from './tracks';
import UserInterface from '../ui/UserInterface';
import { playEngineSound, playCrashSound, stopEngineSound } from './sounds';

const BACKGROUND = 0xe3dbcc;//0x2f3640;
const WHITE = 0xffffff;

export const GAME_OVER_EVENT = {
    type: 'gameOver'
};

export const GAME_RETRY_EVENT = {
    type: 'gameRetry'
};

export const GAME_SCORE_EVENT = {
    type: 'gameScore'
};

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
        this.cursor = new Sprite(SPRITE_SIZE, SPRITE_SIZE, CURSOR);
        const position = getPositionFromRowAndCol(
            0,
            0,
            SPRITE_SIZE,
            SPRITE_SCALE,
            false,
            true
        );

        this.cursor.setScale({ x: CURSOR_SCALE, y: CURSOR_SCALE });
        this.cursor.addTag(CURSOR);
        this.cursor.setPosition(position);
        this.cursor.addScript(CURSOR);

        this.cursor.addEventListener(PLACE_TRACK_EVENT.type, this.handlePlaceTrack);
        this.cursor.addEventListener(TRACK_CLICK_EVENT.type, this.handleTrackClick);
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

        this.trainHead.addScript(TRAIN, true, { tracks: this.tracks, level: this });

        playEngineSound();
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
            level: this
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
        if (result < 0.2) {
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
        const index = this.tracks.findIndex(track => 
            areGridPositionsEqual(track.gridPosition, removedTrack.gridPosition)
        );

        this.tracks[index].dispose();
        this.tracks.splice(index, 1);

        this.trainHead.dispatchEvent({
            ...TRACK_CHANGE_EVENT,
            tracks: this.tracks
        });
    };

    handleTrackClick = (event) => {
        //const nextRotation = getNextRotation(event.track);
        const index = this.tracks.findIndex((track) =>
            areGridPositionsEqual(track.gridPosition, event.track.gridPosition)
        );

        if (this.tracks[index]) {
            this.tracks[index].type = this.toolbarSelection;
            this.tracks[index].setTextureMap(
                TRACK_TYPES_TO_SPRITE_MAP[this.toolbarSelection]
            );
            this.tracks[index].life = MAX_TRACK_LIFE;
            this.tracks[index].setOpacity(1);

            this.trainHead.dispatchEvent({
                ...TRACK_CHANGE_EVENT,
                tracks: this.tracks,
            });
        }
    };

    handleToolbarSelection = (selection) => {
        this.toolbarSelection = selection;
    };

    handleFailure() {
        playCrashSound();
        stopEngineSound();

        this.dispatchEvent({
            ...GAME_OVER_EVENT,
            score: this.score
        });
    }

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
        track.life = MAX_TRACK_LIFE;

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

                this.environment.push(dirt);
                this.environment.push(grass);
            }
        }
    }

    handleRetry = () => {
        this.tracks.forEach(track => track.dispose());
        this.boulders.forEach(boulder => boulder.dispose());
        this.environment.forEach(el => el.dispose());

        this.trainHead.dispose();
        this.trainCarriage.dispose();
        this.cursor.dispose();

        this.stopGame();
        this.startGame();

        this.dispatchEvent(GAME_RETRY_EVENT);
    }

    startGame = () => {
        this.tracks = [];
        this.environment = [];
        this.score = 0;
        this.toolbarSelection = VERTICAL;

        this.buildLevel();
        this.buildInitialtracks();
        this.boulders = [];
        this.obstacleInterval = setInterval(this.rollForObstacle, 1000);
        this.addTrain();
        this.addTrainCarriage();
        this.addCursor();

        window.tracks = this.tracks;
    };

    stopGame = () => {
        this.tracks = [];
        this.toolbarSelection = VERTICAL;

        clearInterval(this.obstacleInterval);
    }

    buildInitialtracks() {
        for (let trackPosition of INITIAL_TRACKS) {
            const { row, col, type } = trackPosition;
            const position = getPositionFromRowAndCol(row, col);

            this.tracks.push(this.createTrackAtPosition(position, type));
        }
    }

    updateScore(track) {
        if (track.type === VERTICAL && track.type === HORIZONTAL) {
            this.score += 100; // each straight track is 100m
        } else {
            this.score += 50; // each curve is a bit less
        }

        this.dispatchEvent({
            ...GAME_SCORE_EVENT,
            score: this.score
        });
    }

    deteriorateTrack = (track) => {
        track.life = track.life - 1;
        const opacity = transformTrackLifeToOpacity(track);

        if (track.life > 0) {
            track.setOpacity(opacity);
        } else {
            this.handleRemoveTrack(track);
        }
    } 

    onCreate() {
        Audio.setVolume(0.1);
        //Scene.setClearColor(BACKGROUND);
        Scripts.create(CURSOR, CursorScript);
        Scripts.create(TRAIN, TrainScript);
        Scripts.create(TRAIN_CARRIAGE, CarriageScript);
        Scripts.create(BOULDER, BoulderScript);
        this.enableUI(UserInterface);
    }

    onBeforeDispose() {
        this.stopGame();
    }
}
