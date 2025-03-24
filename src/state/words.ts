import { createEvent, createStore } from 'effector'

export interface Word {
    key: string;
    definition?: string;
}

export const $words = createStore<Word[]>([]);
export const initWords = createEvent<Word[]>();

$words.on(initWords, (_, state) => state);
