import express from 'express';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const routerEnd = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pathRouter = `${__dirname}`;

const removeExtension = (fileName) => {
    return fileName.split('.').shift();
};

console.log('Endpoints:');
readdirSync(pathRouter).filter((file) => {
    const skip = ['indexRoutes.js'].includes(file);
    if (!skip) {
        const routePath = join(pathRouter, file);
        import(`./${file}`)
            .then((module) => {
                if (module && module.default) {
                    routerEnd.use(`/${removeExtension(file)}`, module.default);
                    console.log('/'+removeExtension(file));
                }
            })
            .catch((error) => {
                console.error(`There was an error importing the module from ${routePath}:`, error);
            });
    }
});

export default routerEnd;