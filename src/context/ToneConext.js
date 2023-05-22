import React, { createContext, useState } from 'react';
import * as Tone from 'tone';

export const ToneContext = createContext();

export const ToneProvider = ({ children }) => {
    const [synth, setSynth] = useState(null);

    const startAudio = async () => {
        await Tone.start();
        setSynth(new Tone.Synth().toDestination());
    };

    return (
        <ToneContext.Provider value={{ synth, startAudio }}>
            {children}
        </ToneContext.Provider>
    );
};