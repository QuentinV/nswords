import React from 'react'
import 'primereact/resources/themes/lara-dark-amber/theme.css';
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import './theme.css';
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage';

function App() {
    return (<>
    <BrowserRouter>
        <Routes>
            <Route
                path='/nswords/games'
                element={
                    <HomePage />
                }
            />
            <Route
                path='/nswords'
                element={<Navigate to={'/nswords/games'} />}
            />
        </Routes>
    </BrowserRouter>
    </>)
}

export default App
