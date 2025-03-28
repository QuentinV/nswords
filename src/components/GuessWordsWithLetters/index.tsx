import { useUnit } from 'effector-react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import React, { useState } from 'react';
import { Divider } from 'primereact/divider';
import { reset, $wordsToGuess, $maxWordsCount, $maxWordLength, setMaxWordsCount, setMaxWordLength, reshuffleLetters, $letters } from '../../state/wordsFromLetters';
import { LetterCanvas } from '../LettersCanvas';

export const GuessWordsWithLetters = () => {
    const wordsToGuess = useUnit($wordsToGuess);
    const maxWordsCount = useUnit($maxWordsCount);
    const maxWordLength = useUnit($maxWordLength);
    const letters = useUnit($letters);
    const [selectedWord, setSelectedWord] = useState<string|null>();

    const onWordComplete = (word: string) => {
        setSelectedWord(null);
    }

    return (
    <div>
        <h2 className='mt-1 text-bluegray-200 text-center'>Devine tous les mots</h2>
        <div className='w-11 text-center text-bluegray-200 m-auto'>
            <InputNumber 
                value={maxWordsCount} 
                min={1} max={10} 
                allowEmpty={false} 
                showButtons
                buttonLayout='horizontal'
                onValueChange={e => setMaxWordsCount(e.value ?? 1)}
            /> mots max <InputNumber 
                value={maxWordLength} 
                min={3} max={25} 
                allowEmpty={false} 
                showButtons
                buttonLayout='horizontal'
                onValueChange={e => setMaxWordLength(e.value ?? 3)}
            /> lettres
        </div>
        <Divider />
        <div className='flex flex-wrap gap-5 row-gap-4 justify-content-center'>
            {wordsToGuess.map( (w, i) => (<div key={i} className='lettersContainer'>
                {w.key.split('').map( (l, k) => (<div key={k} className='letterBox'></div>))}
            </div>))}
        </div>
        <div className='h-2rem mt-3 text-center text-primary' style={{ letterSpacing: '5px' }}>{selectedWord}</div>
        <Divider className='mt-1' />
        <div className='mt-2 text-center relative h-15rem'>
            {!!wordsToGuess.length && (<div className='text-right absolute top-0 right-0'><i className='pi pi-refresh' onClick={() => reshuffleLetters()} /></div>)}
            <LetterCanvas letters={letters} onWordComplete={word => onWordComplete(word)} onLetterSelected={w => setSelectedWord(w)} />
        </div>
        <Divider />
        <div className='mt-6 text-center'>
            <Button severity='info' onClick={() => reset()}><i className='pi pi-refresh' /><span className='ml-2 font-bold'>Nouvelle partie</span></Button>
        </div>
    </div>
    );
}