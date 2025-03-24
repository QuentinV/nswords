import { Button } from 'primereact/button';
import React from 'react';
import { useNavigate } from 'react-router';

export const RandomWord = () => {
    const navigate = useNavigate();
    return (
    <div>
        <div className='m-2'><Button onClick={() => navigate('/')}>Retour</Button></div>
    </div>
    );
}