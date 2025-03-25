import { createEffect, createStore, attach, createEvent, sample } from "effector";
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

const setRandomWord = createEvent<Word|null>();
$randomWord.on(generateRandomWordFx.doneData, (_, state) => state).on(setRandomWord, (_, state) => state);

export const $triesCount = createStore<number>(0);
export const setTriesCount = createEvent<number>();
$triesCount.on(setTriesCount, (_, state) => state);

export const $win = createStore<boolean>(false);
export const setWin = createEvent<boolean>();
$win.on(setWin, (_, state) => state);

export const $maxTries = createStore<number>(5);
export const setMaxTries = createEvent<number>();
$maxTries.on(setMaxTries, (_, state) => state);

interface Letter {
    valid?: 'yes' | 'no' | 'present';
    value: string;
}

type ValueType = { letters: Letter[][] };
export const $value = createStore<ValueType>({ letters: [] });
export const setValue = createEvent<ValueType>();
$value.on(setValue, (_, state) => state);

export const reset = createEvent();
sample({
    clock: reset,
    target: createEffect(() => {
        setWin(false);
        setTriesCount(0);
        setValue({ letters: [] });
        generateRandomWordFx();
    })
})

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

const loadFromLocalStorageFx = createEffect(() => {
    const data = JSON.parse(localStorage.getItem('randomWordData') ?? '{}');
    data?.$randomWord && setRandomWord(data.$randomWord);
    data?.$triesCount && setTriesCount(data.$triesCount);
    data?.$win && setWin(data.$win);
    data?.$maxTries && setMaxTries(data.$maxTries);
    data?.$value && setValue(data.$value);
});

const saveToLocalStorageFx = attach({
    source: { $randomWord, $triesCount, $win, $maxTries, $value },
    effect: createEffect((data: any) => {
        localStorage.setItem('randomWordData', JSON.stringify(data));
    })
});

sample({
    source: [ $randomWord, $triesCount, $win, $maxTries, $value ],
    target: saveToLocalStorageFx
});

loadFromLocalStorageFx();