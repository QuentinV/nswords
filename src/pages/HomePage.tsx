import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { RandomWord } from '../components/RandomWord';

export const HomePage = () => {
    return (
        <div className='flex flex-column h-full'>
            <h1 className='text-primary text-center'>NsWords</h1>
            <TabView className='flex-1 flex flex-column'>
                <TabPanel header="Mot mystère">
                    <RandomWord />
                </TabPanel>
            </TabView>
        </div>
    );
}