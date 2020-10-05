import { Router, store } from 'mage-engine';
import Level from './level';

store.createStore(undefined, {}, true);

const assets = {
    textures: {
        cursor: '/assets/textures/cursor.png',
        train_head: '/assets/textures/train_head.png',
        train_carriage: '/assets/textures/train_carriage.png',
        boulder: '/assets/textures/boulder.png',
        dirt: '/assets/textures/dirt.png',
        grass_1: '/assets/textures/grass_1.png',
        grass_2: '/assets/textures/grass_2.png',
        grass_3: '/assets/textures/grass_3.png',

        tree_1: '/assets/textures/tree_1.png',
        tree_2: '/assets/textures/tree_2.png',
        tree_3: '/assets/textures/tree_3.png',
        tree_4: '/assets/textures/tree_4.png',
        tree_5: '/assets/textures/tree_5.png',
        tree_6: '/assets/textures/tree_6.png',
        tree_7: '/assets/textures/tree_7.png',
        tree_8: '/assets/textures/tree_8.png',
        tree_9: '/assets/textures/tree_9.png',

        tracks_vertical: '/assets/textures/tracks_vertical.png',
        tracks_horizontal: '/assets/textures/tracks_horizontal.png',
        tracks_top_right: '/assets/textures/tracks_top_right.png',
        tracks_top_left: '/assets/textures/tracks_top_left.png',
        tracks_bottom_right: '/assets/textures/tracks_bottom_right.png',
        tracks_bottom_left: '/assets/textures/tracks_bottom_left.png',
    },
    audio: {
        'engine': '/assets/audio/engine.wav',
        'crash': '/assets/audio/crash.wav',
        'click': '/assets/audio/click.wav',
        'start': '/assets/audio/start.wav',
        'game_over': '/assets/audio/game_over.wav'
    }
};

const config = {
    screen: {
        h: window ? window.innerHeight : 800,
        w: window ? window.innerWidth : 600,
        ratio: window ? window.innerWidth / window.innerHeight : 600 / 800,
        frameRate: 60,
        alpha: true,
    },

    lights: {
        shadows: true,
    },

    physics: {
        enabled: false,
    },

    tween: {
        enabled: false,
    },

    camera: {
        fov: 75,
        near: 0.1,
        far: 3000000,
    },
};

window.addEventListener('load', () => {
    Router.on('/', Level);

    Router.start(config, assets, '#gameContainer');
});
