import React, { useState } from 'react'
import { Button } from 'primereact/button';

interface LettersButtonProps {
	letters: string[];
	onWordComplete: (word: string) => void;
	onLetterSelected: (letter: string) => void;
}

export const LettersButton: React.FC<LettersButtonProps> = ({ letters, onWordComplete, onLetterSelected }) => {
    const [selectedWord, setSelectedWord] = useState<string|null>();
    const [activeLettersIndexes, setActiveLettersIndexes] = useState<number[]>([]);

    const onComplete = () => {
        onWordComplete?.(selectedWord ?? '');
        setSelectedWord(null);
        setActiveLettersIndexes([]);
    }

    const onSelect = (letter: string, index: number) => {
        setSelectedWord((selectedWord ?? '') + letter);
        setActiveLettersIndexes([...activeLettersIndexes, index]);
        onLetterSelected?.(letter);
    }

    return (<>
        <div className='flex gap-5 flex-wrap justify-content-center row-gap-3'>
            {letters.map((l, i) => (
                <Button disabled={activeLettersIndexes.includes(i)} key={i} onClick={() => onSelect(l, i)}>{l}</Button>
            ))}
        </div>     
        <Button disabled={!selectedWord} className='mt-5' severity='success' onClick={() => onComplete()}>Deviner</Button> 
    </>);
}