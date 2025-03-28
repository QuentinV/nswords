import { createEffect, createStore, attach, createEvent, sample } from "effector";
import { $words, Word } from "./words";

export const reset = createEvent();

export const $wordsFound = createStore<string[]>([]);
export const $wordsRemaining = createStore<Word[]>([]);
export const $wordsToGuess = createStore<Word[]>([]);
export const $trials = createStore<number>(0);

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

const getFrequencyObj = (str: string) => {
    const freq: {[key: string]: number} = {};
    for (const char of str) {
        freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
}

export const generateWordsFx = attach({
    source: { words: $words, maxWordsCount: $maxWordsCount, maxWordLength: $maxWordLength },
    effect: createEffect(({ words, maxWordsCount, maxWordLength }: { words: Word[], maxWordsCount: number, maxWordLength: number }) => {
        const maxLength = Math.floor(Math.random() * (maxWordLength - 3) + 4 );
        const longestWords = words.filter( w => w.key.length === maxLength );

        const wordIndex = Math.floor(Math.random() * longestWords.length);
        const longestWord = longestWords[wordIndex];
        const longestWordFrequency = getFrequencyObj(longestWord.key);

        const possibleWords = words.filter(w => {
            if (w.key === longestWord.key) return false;
            const freq = getFrequencyObj(w.key);
            return Object.keys(freq).every(c => freq[c] <= (longestWordFrequency[c] || 0));
        });

        if ( possibleWords.length <= maxWordsCount - 1 ) {
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
$wordsToGuess.on(generateWordsFx.doneData, (_, state) => state.map( w => ({ ...w, key: w.key.toUpperCase() })));

$letters
    .on(reshuffleLetters, (state) => shuffleArray(state))
    .on(generateWordsFx.doneData, (_, state) => shuffleArray(state[state.length-1].key.toUpperCase().split('')));

export const findWordFx = attach({
    source: { wordsRemaining: $wordsRemaining },
    mapParams: (params: string, states) => {
        return { word: params, ...states }; 
    },
    effect: createEffect(({ word, wordsRemaining }: { word: string, wordsRemaining: Word[] }) => {
        return wordsRemaining.find(w => w.key === word);
    })
});

$trials
    .on(reset, () => 0)
    .on(findWordFx.doneData, (trials, word) => word ? 0 : (trials === 5 ? 1 : trials + 1 ));

$wordsFound
    .on(reset, () => [])
    .on(findWordFx.doneData, (words, word) => word ? [...words, word.key] : words );

$wordsRemaining
    .on(reset, () => [])
    .on($wordsToGuess.updates, (_, state) => state)
    .on(findWordFx.doneData, (words, word) => word ? words.filter(w => w.key !== word.key) : words);

sample({
    clock: reset,
    target: generateWordsFx
})