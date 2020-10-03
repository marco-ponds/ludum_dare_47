export const DIRT = 'dirt';
export const GRASS_TYPES = ['grass_1', 'grass_2', 'grass_3'];

export const CURSOR = 'cursor';
export const TRACK = 'track';

export const TRAIN = 'train';
export const TRAIN_HEAD = 'train_head';
export const TRAIN_CARRIAGE = 'train_carriage';

export const TRACK_VERTICAL = 'track_vertical';
export const TRACK_HORIZONTAL = 'track_horizontal';
export const TRACK_TOP_LEFT = 'track_top_left';
export const TRACK_TOP_RIGHT = 'track_top_right';
export const TRACK_BOTTOM_LEFT = 'track_bottom_left';
export const TRACK_BOTTOM_RIGHT = 'track_bottom_right';

export const getGrassSprite = () => GRASS_TYPES[Math.floor(Math.random() * GRASS_TYPES.length)];

