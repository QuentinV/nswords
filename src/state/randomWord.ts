import { createEffect, createStore, attach } from "effector";
import { $words, Word } from "./words";

export const $randomWord = createStore<Word|null>(null);

export const generateRandomWordFx = attach({
    source: $words,
    effect: createEffect((words: Word[]) => {
        for(let word = null; !word; word = null) {
            word = words[Math.floor(Math.random() * words.length)];
            if ( word?.definition ) {
                return { key: word.key.toUpperCase(), definition: word.definition };
            }
        }
    })
});

$randomWord.on(generateRandomWordFx.doneData, (_, state) => state);