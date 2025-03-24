import { createEffect, createEvent, createStore, sample } from "effector";
import { $words, Word } from "./words";

export const $randomWord = createStore<string|null>(null);
export const generateRandomWord = createEvent();

sample({
    source: $words,
    clock: generateRandomWord,
    target: createEffect((words: Word[]) => {
        for(let word = null;!!word;) {
            word = words[Math.floor(Math.random() * words.length)];
            if ( word?.definition ) {
                return word;
            }
        }
    })
});