import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { setPwaPrompt } from './state/standalone';


if ( !(window?.navigator as any)?.standalone && !window?.matchMedia('(display-mode: standalone)')?.matches ) {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setPwaPrompt(e);
    });
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/nswords/sw.js')
            .then((registration) => {
                console.log('Service Worker registered:', registration);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}