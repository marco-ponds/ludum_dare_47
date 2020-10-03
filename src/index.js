import { Router, store } from 'mage-engine';
import Level from './level';

store.createStore(undefined, {}, true);

const assets = {
    textures: {
        cursor: '/assets/textures/cursor.png',
        train_head: '/assets/textures/train_head.png',
        train_carriage: '/assets/textures/train_carriage.png',
        dirt: '/assets/textures/dirt.png',
        grass_1: '/assets/textures/grass_1.png',
        grass_2: '/assets/textures/grass_2.png',
        grass_3: '/assets/textures/grass_3.png',
    },
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
