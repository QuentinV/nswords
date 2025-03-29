import { createEffect, createStore } from 'effector'
import { execQuery } from '../api/db';

export interface Word {
    key: string;
    definition?: string;
}

export const $words = createStore<Word[]>([]);

const initWordsFx = createEffect(async () => {
    console.log('loading words...')
    const item: { words: {[key: string]: Word[]} } = await execQuery('default', (s: IDBObjectStore) => s.get(1)); 
    let ws: Word[];  
    if ( item ) {
        ws = [];
        Object.keys(item.words).forEach(k => item.words[k].forEach( w => ws.push(w)));        
    } else {
        ws = await (await fetch(`${process.env.PUBLIC_URL}/lexics/words_fr.json`)).json();
        await execQuery('default', (s: IDBObjectStore) => s.put({ id: 1, words: ws }), 'readwrite');
    }
    return ws;
});

$words.on(initWordsFx.doneData, (_, state) => state);

initWordsFx();