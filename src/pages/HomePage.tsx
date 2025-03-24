import React from 'react';
import { DbInit } from '../components/DbInit';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';

export const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div className='flex flex-column justify-content-center align-items-center gap-5 h-full'>
            <h1 className='text-primary'>NsWords</h1>
            <div><DbInit /></div>
            <Button onClick={() => navigate('/randomWord')}>Devine un mot à partir d&apos;une définition</Button>
            <Button onClick={() => navigate('/guessWordsLetters')}>Deviner plusieurs mot à partir de lettres</Button>
        </div>
    );
}