export const DIRT = 'dirt';
export const GRASS_TYPES = ['grass_1', 'grass_2', 'grass_3'];

export const CURSOR = 'cursor';

export const getGrassSprite = () => GRASS_TYPES[Math.floor(Math.random() * GRASS_TYPES.length)];

