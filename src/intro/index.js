import { Level, Sprite } from 'mage-engine';

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

    onCreate() {
        const player = new Sprite(4, 4, 'player');

        player.setPosition({ z: -1 });
        player.setScale({ x: 0.1, y: 0.1 });
    }
}