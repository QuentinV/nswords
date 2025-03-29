import { useUnit } from 'effector-react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import React, { useState } from 'react';
import { Divider } from 'primereact/divider';
import { reset, $wordsToGuess, $wordsFound, $wordsRemaining, $maxWordsCount, $maxWordLength, setMaxWordsCount, setMaxWordLength, reshuffleLetters, $letters, $trials, findWordFx, setTrials, $buttonsMode, setButtonsMode } from '../../state/wordsFromLetters';
import { LetterCanvas } from '../LettersCanvas';
import { LettersButton } from '../LettersButton';

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
    const [helpDefinition, setHelpDefinition] = useState<string|null>(null);
    const isMobile = ('ontouchstart' in document.documentElement);
    const forcedButtonsMode = !isMobile || letters.length >= 7;
    const buttonsMode = useUnit($buttonsMode) || forcedButtonsMode;

    const onWordComplete = (word: string) => {
        setSelectedWord(null);
        findWordFx(word);
    }

    const needHelp = () => {
        setHelpDefinition(wordsRemaining[Math.round(Math.random() * wordsRemaining.length)]?.definition ?? null);
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
                (<a className='cursor-pointer hover:text-purple-500' onClick={() => needHelp()}>Besoin d&apos;aide ?</a>) : (trials >= 4 ? 
                    (<span className='text-red-500'>Ne pas perdre espoir</span>)
                : (trials >= 3 ? 
                    (<span className='text-red-300'>Presque, ou pas</span>) 
                : (trials >= 2 && (<span className='text-red-200'>Raté</span>)))))}
        </div>
        <Divider className='mt-1' />
        {!!wordsRemaining.length && (<div className={`mt-2 text-center relative ${!buttonsMode && 'h-15rem'}`}>
            {!!wordsToGuess.length && (<div className='text-right absolute top-0 z-5' style={{ right: '-15px'}}><i className='pi pi-refresh' onClick={() => reshuffleLetters()} /></div>)}
            {!forcedButtonsMode && !!wordsToGuess.length && (<div className='text-right absolute z-5' style={{ top: '30px', right: '-15px'}}><i className='pi pi-table' onClick={() => setButtonsMode(!buttonsMode)} /></div>)}
            {!buttonsMode && <LetterCanvas letters={letters} onWordComplete={word => onWordComplete(word)} onLetterSelected={l => setSelectedWord((selectedWord ?? '') + l)} />}
            {buttonsMode && (<LettersButton letters={letters} onWordComplete={word => onWordComplete(word)} onLetterSelected={l => setSelectedWord((selectedWord ?? '') + l)} />) }
        </div>)}
        <Divider />
        <div className='mt-6 text-center'>
            <Button severity='info' onClick={() => reset()}><i className='pi pi-refresh' /><span className='ml-2 font-bold'>Nouvelle partie</span></Button>
        </div>
        <Dialog header='Definitions' visible={helpDefinition !== null} onHide={() => { setHelpDefinition(null); setTrials(0); }} dismissableMask={true}>
            {helpDefinition !== null && (
                <div className={helpDefinition?.trim() ? 'text-primary' : 'text-red-500'}>
                    {helpDefinition?.trim() 
                    ? helpDefinition 
                    : 'Désolé pas de définitions de disponible. Peut être la prochaine fois.'}
                </div>
            )}
        </Dialog>
    </div>
    );
}