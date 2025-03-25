import React from 'react'
import 'primereact/resources/themes/lara-dark-amber/theme.css';
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import './theme.css';
import { HashRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage';
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
        </Routes>
    </HashRouter>
    </>)
}

export default App
