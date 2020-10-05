import { Level, Sprite, Scene, Scripts, Audio } from 'mage-engine';
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
    TREE,
} from './sprites';
import CursorScript, {
    PLACE_TRACK_EVENT,
    TRACK_CLICK_EVENT,
} from './scripts/cursor';
import TrainScript, { TRACK_CHANGE_EVENT } from './scripts/train';
import CarriageScript from './scripts/carriage';
import BoulderScript from './scripts/boulder';

import { VERTICAL, TRACK_TYPES_TO_SPRITE_MAP, MAX_TRACK_LIFE, HORIZONTAL, transformTrackLifeToOpacity, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT } from './tracks';
import UserInterface from '../ui/UserInterface';
import { playEngineSound, playCrashSound, stopEngineSound, playGameOver, playClickSound } from './sounds';
import { startRollingForObstacle, stopRollingForObstacle, clearObstacles } from './obstacles';
import TreeScript from './scripts/tree';

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

export const TOOLBAR_SELECTION_CHANGE_EVENT = {
    type: 'toolbarSelectionChange'
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

    onKeyDown({ event }) {
        switch(event.key) {
            case '1':
                this.dispatchEvent({
                    ...TOOLBAR_SELECTION_CHANGE_EVENT,
                    toolbarSelection: VERTICAL
                });
                playClickSound();
                break;
            case '2':
                this.dispatchEvent({
                    ...TOOLBAR_SELECTION_CHANGE_EVENT,
                    toolbarSelection: HORIZONTAL
                });
                playClickSound();
                break;
            case '3':
                this.dispatchEvent({
                    ...TOOLBAR_SELECTION_CHANGE_EVENT,
                    toolbarSelection: TOP_LEFT
                });
                playClickSound();
                break;
            case '4':
                this.dispatchEvent({
                    ...TOOLBAR_SELECTION_CHANGE_EVENT,
                    toolbarSelection: TOP_RIGHT
                });
                playClickSound();
                break;
            case '5':
                this.dispatchEvent({
                    ...TOOLBAR_SELECTION_CHANGE_EVENT,
                    toolbarSelection: BOTTOM_LEFT
                });
                playClickSound();
                break;
            case '6':
                this.dispatchEvent({
                    ...TOOLBAR_SELECTION_CHANGE_EVENT,
                    toolbarSelection: BOTTOM_RIGHT
                });
                playClickSound();
                break;
        }
    }

    handleToolbarSelection = (selection) => {
        this.toolbarSelection = selection;
    };

    handleFailure() {
        playCrashSound();
        stopEngineSound();

        setTimeout(playGameOver, 2000);

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

        track.setOpacity(1);

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

                dirt.setOpacity(0.4);
                grass.setOpacity(0.5);

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
        clearObstacles();

        this.tracks.forEach(track => track.dispose());
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

        startRollingForObstacle(this);

        this.addTrain();
        this.addTrainCarriage();
        this.addCursor();

        window.tracks = this.tracks;
    };

    stopGame = () => {
        this.tracks = [];
        this.toolbarSelection = VERTICAL;

        stopRollingForObstacle();
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
        Audio.setVolume(2);
        //Scene.setClearColor(BACKGROUND);
        Scripts.create(CURSOR, CursorScript);
        Scripts.create(TRAIN, TrainScript);
        Scripts.create(TRAIN_CARRIAGE, CarriageScript);
        Scripts.create(BOULDER, BoulderScript);
        Scripts.create(TREE, TreeScript);
        this.enableUI(UserInterface);
    }

    onBeforeDispose() {
        this.stopGame();
    }
}
