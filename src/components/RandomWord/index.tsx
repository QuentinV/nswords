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
    const [value, setValue] = useState<{ letters: Letter[][] }>({ letters: [] });
    const refs = [...Array(30)].map( () => useRef(null) );

    const onChange = (row: number, col: number, letter: string, moveTo: number) => {
        if ( letter.length > 1 ) {
            letter = letter[1];
        }

        if ( !value.letters[row] ) {
            value.letters[row] = [];
        }

        value.letters[row][col] = { value: letter };
        setValue({ ...value });
        
        (refs[moveTo]?.current as any)?.focus?.();
    }
    
    const guess = () => {
        const word = value.letters[value.letters.length-1].join('');
        if ( word === randomWord?.key ) {
            alert('wazzaa');
        }
        setTriesCount(triesCount+1);
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
                                {[...Array(randomWord.key.length)].map( (v, k) => (
                                    <td className='p-2 text-center' key={`c-${k}`}>
                                        {i === triesCount && triesCount < maxTries ? 
                                        (<InputText 
                                            ref={refs[k]}
                                            className='w-2rem p-1 text-center' 
                                            autoFocus={k === 0}
                                            value={value.letters[i]?.[k]?.value ?? ''} 
                                            onKeyDown={event => {
                                                if ( event.code === 'Backspace' && !(event.target as any).value ) {
                                                    event.preventDefault();
                                                    onChange(i, k-1, '', k-1);
                                                }
                                            }}
                                            onChange={event => onChange(i, k, event.target.value, event.target.value ? k + 1 : k - 1)} />) : 
                                        value.letters[i]?.[k]?.value}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>)}
            {triesCount === maxTries && (<h3 className='color-red-100'>Dommage c&apos;est perdu!</h3>)}
            <div className='mt-5 flex align-items-center gap-5'>
                {!!randomWord && triesCount < maxTries && <Button onClick={guess}>Deviner</Button>}
                <Button severity='danger' onClick={reset}>{randomWord ? (<i className='pi pi-refresh' />) : 'Nouvelle partie'}</Button>
            </div>
        </div>
    </div>
    );
}