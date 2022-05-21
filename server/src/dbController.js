import fs from 'fs';
import { resolve } from 'path';

const basePath = resolve();

const filenames = {
    messages: resolve(basePath, 'src/db/messages.json'),
    users: resolve(basePath, 'src/db/users.json')
}

// 인코딩을 반드시 명시하지 않으면 깨져서 보일 수 있다.
export const readDB = target => {
    try {
        return JSON.parse(fs.readFileSync(filenames[target], 'utf-8'))
    } catch (err) {
        console.log(err)
    }
}

export const writeDB = (target, data) => {
    try {
        return fs.writeFileSync(filenames[target], JSON.stringify(data))
    } catch (err) {
        console.log(err);
    }
}