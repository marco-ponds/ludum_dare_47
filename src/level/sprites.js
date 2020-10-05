export const DIRT = 'dirt';
export const GRASS_TYPES = ['grass_1', 'grass_2', 'grass_3'];
export const TREE_TYPES = ['tree_1', 'tree_2', 'tree_3', 'tree_4', 'tree_5', 'tree_6', 'tree_7', 'tree_8', 'tree_9'];
export const BOULDER = 'boulder';
export const TREE = 'tree';

export const CURSOR = 'cursor';
export const TRACK = 'track';

export const TRAIN = 'train';
export const TRAIN_HEAD = 'train_head';
export const TRAIN_CARRIAGE = 'train_carriage';

export const TRACK_VERTICAL = 'tracks_vertical';
export const TRACK_HORIZONTAL = 'tracks_horizontal';
export const TRACK_TOP_LEFT = 'tracks_top_left';
export const TRACK_TOP_RIGHT = 'tracks_top_right';
export const TRACK_BOTTOM_LEFT = 'tracks_bottom_left';
export const TRACK_BOTTOM_RIGHT = 'tracks_bottom_right';


export const FIRE = 'fire';

export const getGrassSprite = () =>
    GRASS_TYPES[Math.floor(Math.random() * GRASS_TYPES.length)];

export const getTreeSprite = () =>
    TREE_TYPES[Math.floor(Math.random() * TREE_TYPES.length)];