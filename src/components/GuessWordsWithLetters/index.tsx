import { useUnit } from 'effector-react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import React, { useState } from 'react';
import { Divider } from 'primereact/divider';
import { reset, $wordsToGuess, $wordsFound, $wordsRemaining, $maxWordsCount, $maxWordLength, setMaxWordsCount, setMaxWordLength, reshuffleLetters, $letters, $trials, findWordFx } from '../../state/wordsFromLetters';
import { LetterCanvas } from '../LettersCanvas';

export const GuessWordsWithLetters = () => {
    const wordsToGuess = useUnit($wordsToGuess);
    const wordsFound = useUnit($wordsFound);
    const wordsRemaining = useUnit($wordsRemaining);
    const maxWordsCount = useUnit($maxWordsCount);
    const maxWordLength = useUnit($maxWordLength);
    const letters = useUnit($letters);
    const trials = useUnit($trials);
    const [selectedWord, setSelectedWord] = useState<string|null>();
    const [optionsMenuVisible, setOptionsMenuVisible] = useState<boolean>(false);
    const isMobile = ('ontouchstart' in document.documentElement);

    const onWordComplete = (word: string) => {
        setSelectedWord(null);
        findWordFx(word);
    }

    return (
    <div>
        <h2 className='mt-1 text-bluegray-200 text-center'>
            Devine tous les mots 
            <i className='pi pi-cog ml-4 cursor-pointer hover:text-primary' onClick={() => setOptionsMenuVisible(!optionsMenuVisible)} />
        </h2>
        {optionsMenuVisible && (<div className='w-11 text-center text-bluegray-200 m-auto'>
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
        </div>)}
        <Divider />
        <div className='flex flex-wrap gap-5 row-gap-4 justify-content-center'>
            {wordsToGuess.map( (w, i) => {
                const found = wordsFound.includes(w.key);
                return (<div key={i} className={`lettersContainer ${found && 'box-ok'}`}>
                    {w.key.split('').map( (l, k) => (<div key={k} className='letterBox'>{found && l}</div>))}
                </div>)
            })}
        </div>
        <div className='h-2rem mt-5 mb-2 text-center text-primary' style={{ letterSpacing: '5px' }}>
            {!!wordsToGuess.length && !wordsRemaining.length && (
                <h3 className='text-primary'>
                    <i className='pi pi-face-smile text-primary mr-3' /> 
                    Bravo c&apos;est gagné !
                </h3>
            )}
            {!!selectedWord && selectedWord}
            {!selectedWord && (trials >= 5 ? 
                (<a className='cursor-pointer hover:text-purple-500'>Besoin d&apos;aide ?</a>) : (trials >= 4 ? 
                    (<span className='text-red-500'>Ne pas perdre espoir</span>)
                : (trials >= 3 ? 
                    (<span className='text-red-300'>Presque, ou pas</span>) 
                : (trials >= 2 && (<span className='text-red-200'>Raté</span>)))))}
        </div>
        <Divider className='mt-1' />
        {!!wordsRemaining.length && (<div className='mt-2 text-center relative h-15rem'>
            {!!wordsToGuess.length && (<div className='text-right absolute top-0 z-5' style={{ right: '-15px'}}><i className='pi pi-refresh' onClick={() => reshuffleLetters()} /></div>)}
            {isMobile && letters.length < 7 && <LetterCanvas letters={letters} onWordComplete={word => onWordComplete(word)} onLetterSelected={l => setSelectedWord((selectedWord ?? '') + l)} />}
            {(!isMobile || letters.length >= 7) && (<>                
                <div className='flex gap-5 flex-wrap justify-content-center'>
                    {letters.map((l, i) => (
                        <Button key={i} onClick={() => setSelectedWord((selectedWord ?? '') + l)}>{l}</Button>
                    ))}
                </div>     
                <Button className='mt-5' severity='success' onClick={() => onWordComplete(selectedWord ?? '')}>Deviner</Button>           
            </>) }
        </div>)}
        <Divider />
        <div className='mt-6 text-center'>
            <Button severity='info' onClick={() => reset()}><i className='pi pi-refresh' /><span className='ml-2 font-bold'>Nouvelle partie</span></Button>
        </div>
    </div>
    );
}