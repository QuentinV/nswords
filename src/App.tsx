import React from 'react'
import 'primereact/resources/themes/mira/theme.css';
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage';

function App() {
    return (
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
    )
}

export default App
