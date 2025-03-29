import { createEffect, createStore, attach, createEvent, sample } from "effector";
import { $words, Word } from "./words";

const loadFromLocalStorageFx = createEffect(() => JSON.parse(localStorage.getItem('randomWordData') ?? '{}'));

export const reset = createEvent();
export const $randomWord = createStore<Word|null>(null);
export const $wordLengthConf = createStore<number>(7);
export const $triesCount = createStore<number>(0);
export const setTriesCount = createEvent<number>();
export const $win = createStore<boolean>(false);
export const setWin = createEvent<boolean>();
export const $maxTries = createStore<number>(5);
export const setMaxTries = createEvent<number>();
export const setWordLengthConf = createEvent<number>();

interface Letter {
    valid?: 'yes' | 'no' | 'present';
    value: string;
}

type ValueType = { letters: Letter[][] };
export const $value = createStore<ValueType>({ letters: [] });
export const setValue = createEvent<ValueType>();

export const generateRandomWordFx = attach({
    source: { words: $words, wordLengthConf: $wordLengthConf },
    effect: createEffect(({ words, wordLengthConf } : { words: Word[], wordLengthConf: number }) => {
        let wordsList: Word[] = [];
        for (; !wordsList?.length && wordLengthConf >= 3;) {
            wordsList = words.filter( w => w.key.length === wordLengthConf);
            if ( !wordsList.length ) {  
                wordLengthConf--;
            }
        }
        setWordLengthConf(wordLengthConf);
        for(let word = null; !word; word = null) {
            word = wordsList[Math.floor(Math.random() * (wordsList.length-1))];
            if ( word?.definition ) {
                return { key: word.key.toUpperCase(), definition: word.definition };
            }
        }
    })
});

export const guessFx = attach({
    source: { randomWord: $randomWord, value: $value, triesCount: $triesCount },
    effect: createEffect(({ randomWord, value, triesCount }: { randomWord: Word | null, value: ValueType, triesCount: number }) => {
        if ( !randomWord || !value.letters.length ) return;

        value.letters[value.letters.length-1] = value.letters[value.letters.length-1].map((letter, i) => ({
            value: letter.value,
            valid: randomWord.key[i] === letter.value ? 'yes' : randomWord.key.indexOf(letter.value) !== -1 ? 'present' : 'no'  
        }))
        setValue({ ...value });
        
        setTriesCount(triesCount+1);
        if ( randomWord.key.length === value.letters[value.letters.length-1].length 
            && value.letters[value.letters.length-1].every( letter => letter.valid === 'yes' ) ) {
            setWin(true);
        }
    })
});

$randomWord
    .on(generateRandomWordFx.doneData, (_, state) => state)
    .on(loadFromLocalStorageFx.doneData, (_, data: any) => data.$randomWord ?? null);

$triesCount
    .on(setTriesCount, (_, state) => state)
    .on(loadFromLocalStorageFx.doneData, (_, data: any) => data.$triesCount ?? 0);

$win
    .on(setWin, (_, state) => state)
    .on(loadFromLocalStorageFx.doneData, (_, data: any) => data.$win ?? false);

$maxTries
    .on(setMaxTries, (_, state) => state)
    .on(loadFromLocalStorageFx.doneData, (_, data: any) => data.$maxTries ?? 5);

$value
    .on(setValue, (_, state) => state)
    .on(loadFromLocalStorageFx.doneData, (_, data: any) => data.$value ?? { letters: [] });

$wordLengthConf
    .on(loadFromLocalStorageFx.doneData, (_, data: any) => data.$wordLengthConf ?? 7)
    .on(setWordLengthConf, (_, state) => state);

sample({
    clock: reset,
    target: createEffect(() => {
        setWin(false);
        setTriesCount(0);
        setValue({ letters: [] });
        generateRandomWordFx();
    })
})

sample({
    source: { $randomWord, $triesCount, $win, $maxTries, $value, $wordLengthConf },
    target: createEffect((data: any) => localStorage.setItem('randomWordData', JSON.stringify(data)))
});

loadFromLocalStorageFx();