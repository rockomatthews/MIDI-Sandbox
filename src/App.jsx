// import React from 'react'
import './App.css'
import { ToneProvider } from './context/ToneContext';
import MIDIComponent from './components/MIDIComponent'


function App() {


  return (
    <>
      <div className='logo'>
        <h1>MIDI SandBox</h1>
      </div>
      <div>
        <ToneProvider>
          <MIDIComponent />
        </ToneProvider>
      </div>

    </>
  )
}

export default App
