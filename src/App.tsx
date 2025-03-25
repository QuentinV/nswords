import React from 'react'
import 'primereact/resources/themes/lara-dark-amber/theme.css';
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage';
import { RandomWord } from './components/RandomWord';
import { GuessWordsWithLetters } from './components/GuessWordsWithLetters';
import { DbInit } from './components/DbInit';

function App() {
    return (<>
    <DbInit />
    <HashRouter>
        <Routes>
            <Route
                index
                element={
                    <HomePage />
                }
            />
            <Route
                path='/randomWord'
                element={
                    <RandomWord />
                }
            />
            <Route
                path='/guessWordsLetters'
                element={
                    <GuessWordsWithLetters />
                }
            />
        </Routes>
    </HashRouter>
    </>)
}

export default App
