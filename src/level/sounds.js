import { Sound } from "mage-engine"

export const playClickSound = () => (
    new Sound('click').start()
);

export const playCrashSound = () => (
    new Sound('crash').start()
);

let engineSound;
export const playEngineSound = () => {
    engineSound = new Sound('engine', { loop: true });

    engineSound.start();
}

export const stopEngineSound = () => {
    if (engineSound) {
        engineSound.stop();
        engineSound = null;
    }
}