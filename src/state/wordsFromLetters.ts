import { createEffect, createStore, attach, createEvent, sample } from "effector";
import { $words, Word } from "./words";

export const reset = createEvent();
const loadFromLocalStorageFx = createEffect(() => JSON.parse(localStorage.getItem('guesswords') ?? '{}'));

export const $wordsFound = createStore<string[]>([]);
export const $wordsRemaining = createStore<Word[]>([]);
export const $wordsToGuess = createStore<Word[]>([]);
export const $trials = createStore<number>(0);
export const setTrials = createEvent<number>();

export const $maxWordsCount = createStore<number>(5);
export const $maxWordLength = createStore<number>(5);
export const setMaxWordsCount = createEvent<number>();
export const setMaxWordLength = createEvent<number>();

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

export const findWordFx = attach({
    source: { wordsRemaining: $wordsRemaining },
    mapParams: (params: string, states) => {
        return { word: params, ...states }; 
    },
    effect: createEffect(({ word, wordsRemaining }: { word: string, wordsRemaining: Word[] }) => {
        return wordsRemaining.find(w => w.key === word);
    })
});

$maxWordsCount
    .on(setMaxWordsCount, (_, state) => state)
    .on(loadFromLocalStorageFx.doneData, (_, data: any) => data.$maxWordsCount ?? 5);

$maxWordLength
    .on(setMaxWordLength, (_, state) => state)
    .on(loadFromLocalStorageFx.doneData, (_, data: any) => data.$maxWordLength ?? 5);

$letters
    .on(loadFromLocalStorageFx.doneData, (_, data: any) => data.$letters ?? [])
    .on(reshuffleLetters, (state) => shuffleArray(state))
    .on(generateWordsFx.doneData, (_, state) => shuffleArray(state[state.length-1].key.toUpperCase().split('')));

$wordsToGuess
    .on(loadFromLocalStorageFx.doneData, (_, data: any) => data.$wordsToGuess ?? [])
    .on(generateWordsFx.doneData, (_, state) => state.map( w => ({ ...w, key: w.key.toUpperCase() })));

$trials
    .on(loadFromLocalStorageFx.doneData, (_, data: any) => data.$trials ?? 0)
    .on(reset, () => 0)
    .on(findWordFx.doneData, (trials, word) => word ? 0 : (trials === 5 ? 1 : trials + 1 ))
    .on(setTrials, (_, state) => state);

$wordsFound
    .on(loadFromLocalStorageFx.doneData, (_, data: any) => data?.$wordsFound ?? [])
    .on(reset, () => [])
    .on(findWordFx.doneData, (words, word) => word ? [...words, word.key] : words );

$wordsRemaining
    .on(reset, () => [])
    .on(generateWordsFx.doneData, (_, state) => state.map( w => ({ ...w, key: w.key.toUpperCase() })))
    .on(findWordFx.doneData, (words, word) => word ? words.filter(w => w.key !== word.key) : words)
    .on(loadFromLocalStorageFx.doneData, (_, data: any) => data.$wordsRemaining ?? []);

sample({
    clock: reset,
    target: generateWordsFx
})

sample({
    source: { $maxWordsCount, $maxWordLength, $letters, $wordsToGuess, $trials, $wordsFound, $wordsRemaining },
    target: createEffect((data: any) => localStorage.setItem('guesswords', JSON.stringify(data)))
})

loadFromLocalStorageFx();