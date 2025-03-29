import { useUnit } from 'effector-react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import React, { useState } from 'react';
import { Divider } from 'primereact/divider';
import { reset, $wordsToGuess, $wordsFound, $wordsRemaining, $maxWordsCount, $maxWordLength, setMaxWordsCount, setMaxWordLength, reshuffleLetters, $letters, $trials, findWordFx, setTrials, $buttonsMode, setButtonsMode, addLetterHelp, $lettersHelp } from '../../state/wordsFromLetters';
import { LetterCanvas } from '../LettersCanvas';
import { LettersButton } from '../LettersButton';
import { Word } from '../../state/words';

export const GuessWordsWithLetters = () => {
    const wordsToGuess = useUnit($wordsToGuess);
    const wordsFound = useUnit($wordsFound);
    const wordsRemaining = useUnit($wordsRemaining);
    const maxWordsCount = useUnit($maxWordsCount);
    const maxWordLength = useUnit($maxWordLength);
    const letters = useUnit($letters);
    const lettersHelp = useUnit($lettersHelp);
    const trials = useUnit($trials);
    const [selectedWord, setSelectedWord] = useState<string|null>();
    const [optionsMenuVisible, setOptionsMenuVisible] = useState<boolean>(false);
    const [helpDefinition, setHelpDefinition] = useState<Word|null>(null);
    const isMobile = ('ontouchstart' in document.documentElement);
    const forcedButtonsMode = !isMobile || letters.length >= 7;
    const buttonsMode = useUnit($buttonsMode) || forcedButtonsMode;

    const onWordComplete = (word: string) => {
        setSelectedWord(null);
        findWordFx(word);
    }

    const needHelp = (firstAvailable?: boolean) => {
        setHelpDefinition((firstAvailable ? wordsRemaining.find(w => !!w.definition) : wordsRemaining[Math.round(Math.random() * wordsRemaining.length)]) ?? null);
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
        <div className='flex flex-wrap gap-5 row-gap-4 justify-content-center relative'>
            {!!wordsToGuess.length && (
                <div className='text-right absolute z-5' style={{ top:'-10px', right: '-15px'}}><i className='pi pi-info-circle text-lg' onClick={() => needHelp(true)} /></div>
            )}
            {wordsToGuess.map( (w, i) => {
                const found = wordsFound.includes(w.key);
                return (<div key={i} className={`lettersContainer ${found && 'box-ok'}`}>
                    {w.key.split('').map( (l, k) => (<div key={k} className='letterBox'>{(found || !!lettersHelp?.[i]?.[k]) && l}</div>))}
                </div>)
            })}
        </div>
        <div className='h-2rem mt-5 mb-2 text-center text-primary'>
            {!!wordsToGuess.length && !wordsRemaining.length && (
                <h3 className='text-primary'>
                    <i className='pi pi-face-smile text-primary mr-3' /> 
                    Bravo c&apos;est gagné !
                </h3>
            )}
            {!!selectedWord && (<span style={{ letterSpacing: '5px' }}>{selectedWord}</span>)}
            {!selectedWord && (
                trials === 5 ? (<a className='cursor-pointer text-red-500' onClick={() => addLetterHelp()}>Besoin d&apos;une lettre ?</a>)
                : trials === 4 ? (<a className='cursor-pointer text-red-400' onClick={() => needHelp()}>Besoin d&apos;aide ?</a>) 
                : trials === 3 ? (<span className='text-red-300'>Ne pas perdre espoir</span>)
                : trials === 2 ? (<span className='text-red-200'>Presque, ou pas</span>) 
                : trials === 1 && (<span className='text-red-100'>Raté</span>)
            )}
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
            {helpDefinition !== null && (<>
                <div className='font-italic text-sm mb-2'>{helpDefinition.key.length} lettres</div>
                <div className={helpDefinition?.definition?.trim() ? 'text-primary' : 'text-red-500'}>
                    {helpDefinition?.definition?.trim() 
                    ? helpDefinition.definition 
                    : 'Désolé pas de définitions de disponible. Peut être la prochaine fois.'}
                </div>
            </>)}
        </Dialog>
    </div>
    );
}