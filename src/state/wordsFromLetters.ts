import { createEvent, createStore, sample, createEffect } from "effector";
import { $words, Word } from "./words";

export const $wordsToGuess = createStore<Word[]>([]);
export const generateWordsToGuess = createEvent();

sample({
    source: $words,
    clock: generateWordsToGuess,
    target: createEffect((words: Word[]) => {
        
    })
})