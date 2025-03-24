import React, { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { execQuery } from '../../api/db';
import { $words, initWords, Word } from '../../state/words';

export const DbInit = () => {
    const words = useUnit($words);

    useEffect(() => {
        (async () => {
            if ( words.length ) return;
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
            initWords(ws);  
        })();
    }, []);

    return (
        <div>
            {!words?.length && (<div>Initialization de la base de donnée</div>)}
        </div>
    );
}