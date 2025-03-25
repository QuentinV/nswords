import { useUnit } from 'effector-react';
import { Button } from 'primereact/button';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { $randomWord, generateRandomWordFx } from '../../state/randomWord';

interface Letter {
    valid?: 'yes' | 'no' | 'present';
    value: string;
}

const maxTries = 5;

export const RandomWord = () => {
    const navigate = useNavigate();
    const randomWord = useUnit($randomWord);
    const [triesCount, setTriesCount] = useState<number>(0);
    const [win, setWin] = useState<boolean>(false);
    const [value, setValue] = useState<{ letters: Letter[][] }>({ letters: [] });
    const refs = [...Array(30)].map( () => useRef(null) );

    const onChange = (row: number, col: number, letter: string, moveTo: number) => {
        if ( letter.length > 1 ) {
            letter = letter[1];
        }

        if ( !value.letters[row] ) {
            value.letters[row] = [];
        }

        value.letters[row][col] = { value: letter?.toUpperCase() };
        setValue({ ...value });
        
        (refs[moveTo]?.current as any)?.focus?.();
    }
    
    const guess = () => {
        if ( !randomWord ) return;

        value.letters[value.letters.length-1] = value.letters[value.letters.length-1].map((letter, i) => ({
            value: letter.value,
            valid: randomWord.key[i] === letter.value ? 'yes' : randomWord.key.indexOf(letter.value) !== -1 ? 'present' : 'no'  
        }))
        setValue({ ...value });

        setTriesCount(triesCount+1);
        if ( value.letters[value.letters.length-1].every( letter => letter.valid === 'yes' ) ) {
            setWin(true);
        }
    }
    
    const reset = () => {
        setTriesCount(0);
        setValue({ letters: [] });
        generateRandomWordFx();
    }
    
    return (
    <div>
        <div className='m-2'><Button onClick={() => navigate('/')}><i className='pi pi-home' /></Button></div>
        <div className='flex flex-column align-items-center'>
            <h1 className='text-primary mt-0'>NsWords</h1>
            <h2>Devine un mot</h2>
            {randomWord && (<div className='w-full'>
                <div>
                    <Divider className='col-8 m-auto mb-2' />
                    <h4 className='pl-2 pr-2 m-auto col-10'>{randomWord?.definition}</h4>
                    <Divider className='col-8 m-auto mt-2 mb-2' />
                </div>
                <div className='overflow-auto'>
                    <table className='w-min m-auto'>
                    <tbody>
                        {[...Array(maxTries)].map((v, i) => (
                            <tr key={`r-${i}`}>
                                {[...Array(randomWord.key.length)].map( (v, k) => {
                                    const letter = value.letters[i]?.[k];
                                    return (
                                        <td 
                                            className={ `p-2 text-center ${i !== triesCount && value.letters[i] && (letter?.valid === 'yes' ? 'elem-ok' : letter?.valid === 'present' ? 'elem-present' : 'elem-none' )}` } 
                                            key={`c-${k}`}
                                        >
                                            {!win && i === triesCount && triesCount < maxTries ? 
                                            (<InputText 
                                                ref={refs[k]}
                                                className='w-2rem p-1 text-center' 
                                                autoFocus={k === 0}
                                                value={letter?.value ?? ''}
                                                onKeyDown={event => {
                                                    if ( event.code === 'Backspace' && !(event.target as any).value ) {
                                                        event.preventDefault();
                                                        onChange(i, k-1, '', k-1);
                                                    }
                                                }}
                                                onChange={event => onChange(i, k, event.target.value, event.target.value ? k + 1 : k - 1)} />) : 
                                            value.letters[i]?.[k]?.value}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>)}
            {!win && triesCount === maxTries && (<h3 className='text-red-400'>Dommage c&apos;est perdu!</h3>)}
            {win && (<h3 className='text-blue-400'>
                <i className='pi pi-face-smile text-primary mr-3' /> 
                Bravo c&apos;est gagné ! 
                <i className='pi pi-face-smile text-primary ml-3' />
            </h3>)}
            <div className='mt-5 flex align-items-center gap-5'>
                {!win && !!randomWord && triesCount < maxTries && <Button onClick={guess}>Deviner</Button>}
                <Button severity={ randomWord ? 'danger' : 'info'} onClick={reset}><i className='pi pi-refresh' />{!randomWord && (<span className='ml-2 font-bold'>Nouvelle partie</span>)}</Button>
            </div>
        </div>
    </div>
    );
}