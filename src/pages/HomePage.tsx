import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { RandomWord } from '../components/RandomWord';
import { GuessWordsWithLetters } from '../components/GuessWordsWithLetters';
import { useUnit } from 'effector-react';
import { $pwaPrompt, setPwaPrompt } from '../state/standalone';

export const HomePage = () => {
    const pwaPrompt = useUnit($pwaPrompt);

    return (
        <div className='flex flex-column h-full'>
            <h1 className='text-primary text-center mb-0 mt-2'>
                NsWords
                {!!pwaPrompt && (
                    <span className='text-green-500 cursor-pointer hover:text-primary' onClick={() => {
                        pwaPrompt.prompt();
                        pwaPrompt.userChoice.then(() => setPwaPrompt(null));
                    }}>
                        <i className='text-2xl ml-3 pi pi-cloud-download'/> <span className='text-xs vertical-align-middle'>Installer</span>
                    </span>
                )}
            </h1>
            <TabView className='flex-1 flex flex-column overflow-hidden'>
                <TabPanel header="Mots mélées">
                    <GuessWordsWithLetters />
                </TabPanel>
                <TabPanel header="Mot mystère">
                    <RandomWord />
                </TabPanel>
            </TabView>
        </div>
    );
}