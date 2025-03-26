import { createEffect, createStore, attach, createEvent, sample } from "effector";
import { $words, Word } from "./words";

export const reset = createEvent();

export const $wordsToGuess = createStore<Word[]>([]);
export const $maxWordsCount = createStore<number>(5);
export const $maxWordLength = createStore<number>(5);
export const setMaxWordsCount = createEvent<number>();
export const setMaxWordLength = createEvent<number>();
$maxWordsCount.on(setMaxWordsCount, (_, state) => state);
$maxWordLength.on(setMaxWordLength, (_, state) => state);

export const $letters = createStore<string[]>([]);
export const reshuffleLetters = createEvent();

export const shuffleArray = (array?: string[]): string[] | undefined => {
    if ( !array ) return;
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }
    return shuffledArray;
};

export const generateWordsFx = attach({
    source: { words: $words, maxWordsCount: $maxWordsCount, maxWordLength: $maxWordLength },
    effect: createEffect(({ words, maxWordsCount, maxWordLength }: { words: Word[], maxWordsCount: number, maxWordLength: number }) => {
        const maxLength = Math.floor(Math.random() * (maxWordLength - 3) + 4 );
        const longestWords = words.filter( w => w.key.length === maxLength );

        const wordIndex = Math.floor(Math.random() * longestWords.length);
        const longestWord = longestWords[wordIndex];
        const possibleWords = words.filter(w => w.key !== longestWord.key && w.key.split('').every( l => longestWord.key.includes(l) ));

        if ( possibleWords.length === maxWordsCount - 1 ) {
            return [...possibleWords, longestWord];
        }

        if ( possibleWords.length === 0 ) {
            return [longestWord];
        }

        const selectedWords: Word[] = [];
        for ( let i = 0; i < maxWordsCount - 1; ++i ) {
            const wIndex = Math.floor(Math.random() * possibleWords.length);
            if ( selectedWords.some( sw => sw.key === possibleWords[wIndex].key ) ) {
                i--;
            } else {
                selectedWords.push(possibleWords[wIndex]);
            }
        }
        
        return [...selectedWords, longestWord];
    })
});
$wordsToGuess.on(generateWordsFx.doneData, (_, state) => state);
$letters
    .on(reshuffleLetters, (state) => shuffleArray(state))
    .on(generateWordsFx.doneData, (_, state) => shuffleArray(state[state.length-1].key.split('')));

sample({
    clock: reset,
    target: generateWordsFx
})