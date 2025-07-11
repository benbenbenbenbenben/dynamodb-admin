import { describe, it, expect } from 'vitest';
import { extractKeysForItems } from './util.ts';

const items = [
    {
        attribute1: 'value',
        attribute2: 'value',
    },
    {
        attribute1: 'value',
        attribute2: 'value',
        attribute3: 'value',
    },
    {
        attribute3: 'value',
        attribute4: 'value',
    },
];

describe('extractKeysForItems', () => {
    it('extract keys from multiple items', () => {
        const parsedKey = extractKeysForItems(items);
        expect(parsedKey).toEqual([
            'attribute1',
            'attribute2',
            'attribute3',
            'attribute4',
        ]);
    });
});
