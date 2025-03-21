import { createHash } from 'crypto';

function generateHash(text: string) {
    return createHash('md5').update(text).digest('hex');
}

export { generateHash };