import { createEvent, createStore } from "effector";

export const $pwaPrompt = createStore<any|null>(null);
export const setPwaPrompt = createEvent<any>();
$pwaPrompt.on(setPwaPrompt, (_, state) => state);