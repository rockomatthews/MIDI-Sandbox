import React, { createContext, useState } from 'react';
import * as Tone from 'tone';

export const ToneContext = createContext();

export const ToneProvider = ({ children }) => {
    const [synth, setSynth] = useState(null);
    const [isStarted, setIsStarted] = useState(false);

    const startAudio = async () => {
        if (!isStarted) {
            await Tone.start();
            setSynth(new Tone.Synth().toDestination());
            setIsStarted(true);
        }
    };

    return (
        <ToneContext.Provider value={{ synth, startAudio }}>
            {children}
        </ToneContext.Provider>
    );
};