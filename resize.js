const jimp = require('jimp');
const glob = require('glob');

const SIZE = 64;

const source = './assets/textures/small';
const destination = './assets/textures';

const convert = (file) => (
    jimp
        .read(`${source}/${file}`)
        .then(img => img.resize(SIZE, SIZE).write(`${destination}/${file}`))
        .then(() => console.log(`done converting ${file}`))
);

glob(`${source}/*.png`, {}, (_, files) => {
    files
        .map(fullPath => fullPath.replace(`${source}/`, ''))
        .forEach(convert);
});