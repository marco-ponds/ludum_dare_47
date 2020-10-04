import { BaseScript, Input } from 'mage-engine';
import { CURSOR, TRACK } from '../sprites';

export const PLACE_TRACK_EVENT = {
    type: 'placeTrack'
};

export const TRACK_CLICK_EVENT = {
    type: 'trackClick'
};

export default class CursorScript extends BaseScript {

    constructor() {
        super('cursor');
    }

    start(cursor) {
        this.cursor = cursor;

        Input.addEventListener('mouseMove', this.handleMouseMove);
        Input.addEventListener('meshClick', this.handleMeshClick);
    }

    isIntersectionBackground = ({ mesh }) => mesh.hasTag('background');
    isIntersectingTracks = ({ mesh }) => mesh.hasTag(TRACK);

    handleMouseMove = () => {
        const intersections = Input.mouse.getIntersections();
        const [intersection] = intersections.filter(this.isIntersectionBackground);
        
        if (intersection) {
            this.cursor.setPosition(intersection.mesh.getPosition());
        }
    };

    filterOutMyself = ({ mesh }) => !mesh.hasTag(CURSOR);

    isOnlyIntersectingBackground = list => list.length === list.filter(this.isIntersectionBackground).length; 

    handleMeshClick = ({ meshes }) => {
        const filtered = meshes.filter(this.filterOutMyself);

        if (this.isOnlyIntersectingBackground(filtered)) {
            const [first] = filtered;
            this.cursor.dispatchEvent({
                ...PLACE_TRACK_EVENT,
                position: first.mesh.getPosition()
            })
        } else {
            const [intersection] = filtered.filter(this.isIntersectingTracks);

            if (intersection) {
                this.cursor.dispatchEvent({
                    ...TRACK_CLICK_EVENT,
                    track: intersection.mesh
                });
            }
        }
    }
}