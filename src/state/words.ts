import { createEffect, createStore } from 'effector'
import { execQuery } from '../api/db';

const version = '1.0.2';

export interface Word {
    key: string;
    definition?: string;
}

export const $words = createStore<Word[]>([]);

const initWordsFx = createEffect(async () => {
    console.log('loading words...')
    const item: { version: string; words: Word[] } = await execQuery('default', (s: IDBObjectStore) => s.get(1)); 
    let ws: Word[];  
    if ( item && item.version === version ) {
        ws = item.words;      
    } else {
        ws = await (await fetch(`${process.env.PUBLIC_URL}/lexics/words_fr.json`)).json();
        await execQuery('default', (s: IDBObjectStore) => s.put({ id: 1, words: ws, version }), 'readwrite');
        document.location.reload();
    }
    return ws;
});

$words.on(initWordsFx.doneData, (_, state) => state);

initWordsFx();