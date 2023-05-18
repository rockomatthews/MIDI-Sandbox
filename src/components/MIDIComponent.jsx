import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { Midi } from 'tone'; // corrected line
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const MIDIComponent = () => {

  const synth = new Tone.Synth().toDestination();
  const [midiAccess, setMidiAccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    synth.triggerRelease();
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
    // Add your recording logic here
  };

  useEffect(() => {
    if(navigator.requestMIDIAccess){
      navigator.requestMIDIAccess().then(
        (midiAccess) => {
          setMidiAccess(midiAccess);
          for (let input of midiAccess.inputs.values()) {
            input.onmidimessage = getMIDIMessage;
          }
        },
        () => console.log('Could not access your MIDI devices.')
      );
    } else {
      console.log('WebMIDI is not supported in this browser.');
    }

    const getMIDIMessage = (message) => {
      let command = message.data[0];
      let note = message.data[1];
      let velocity = (message.data.length > 2) ? message.data[2] : 0;

      switch (command) {
        case 144:
          if (velocity > 0) {
            synth.triggerAttack(Midi(note).toFrequency());
          } else {
            synth.triggerRelease();
          }
          break;
        case 128:
          synth.triggerRelease();
          break;
      }
    };

    return () => synth.dispose();

  }, []); 

  return (
    <div>
      <h1>Web MIDI API Component</h1>
      {midiAccess && Array.from(midiAccess.inputs.values()).map((input, index) => (
        <Button variant="contained" color="primary" onClick={handleOpen} key={index}>
          {`Use MIDI Device ${index+1}`}
        </Button>
      ))}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <h2 id="modal-modal-title">MIDI Controller</h2>
          <p id="modal-modal-description">Use your MIDI device to control the synth. Press the button to start or stop recording.</p>
          <Button variant="contained" color={isRecording ? "secondary" : "primary"} onClick={handleRecording}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default MIDIComponent;
