import { BaseScript, Input } from 'mage-engine';


export default class CursorScript extends BaseScript {

    constructor() {
        super('cursor');
    }

    start(cursor) {
        this.cursor = cursor;

        Input.addEventListener('mouseMove', this.handleMouseMove);
    }

    handleMouseMove = () => {
        const [intersection] = Input.mouse.getIntersections();

        if (intersection && intersection.mesh.hasTag('background')) {
            this.cursor.setPosition(intersection.mesh.getPosition());
        }
    };
}