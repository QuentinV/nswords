import { useUnit } from 'effector-react';
import { Button } from 'primereact/button';
import React, { useState } from 'react';
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

    const onChange = (row: number, col: number, letter: string) => {
        if ( !value.letters[row] ) value.letters[row] = [];
        value.letters[row][col] = { value: letter };
        setValue({ ...value });
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
            {randomWord && (<div>
                <Divider className='col-8 m-auto mb-2' />
                <h4 className='pl-2 pr-2 m-auto col-10'>{randomWord?.definition}</h4>
                <Divider className='col-8 m-auto mt-2 mb-2' />
                <table className='w-min m-auto'>
                <tbody>
                    {[...Array(maxTries)].map((v, i) => (
                        <tr key={`r-${i}`}>
                            {[...Array(randomWord.key.length)].map( (v, k) => (
                                <td className='p-2 text-center' key={`c-${k}`}>
                                    {i === triesCount && triesCount < maxTries ? 
                                    (<InputText 
                                        className='w-2rem p-1 text-center' 
                                        value={value.letters[i]?.[k]?.value ?? ''} 
                                        onInput={(event: any) => { if ( event.target.value?.length > 1 ) event.target.value = value.letters[i]?.[k]?.value ?? ''; }} 
                                        onChange={event => onChange(i, k, event.target.value)} />) : 
                                    value.letters[i]?.[k]?.value}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>)}
            {triesCount === maxTries && (<h3 className='color-red-100'>Dommage c&apos;est perdu!</h3>)}
            <div className='mt-5'>
                {triesCount < maxTries && <Button className='mr-5' onClick={guess}>Deviner</Button>}
                <Button onClick={reset}>Nouvelle partie</Button>
            </div>
        </div>
    </div>
    );
}