import { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { Midi } from 'tone';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

const MIDIComponent = () => {
  const AudioContext = window.AudioContext || window.AudioContext;

  const audioContext = new AudioContext();
  const synth = new Tone.Synth().toDestination();
  const [midiAccess, setMidiAccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('');

  const handleOpen = async () => {
    await Tone.start();
    console.log('audio is ready');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    synth.triggerRelease();
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
    // Add your recording logic here
  };

  const saveRecording = () => {
    // Add your saving logic here
  };

  const clearRecording = () => {
    // Add your clear logic here
  };

  const playbackRecording = () => {
    // Add your playback logic here
  };

  const handleChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
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
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Select MIDI Device
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="select-midi-device"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="select-midi-device">Select MIDI Device</InputLabel>
            <Select
              labelId="select-midi-device"
              id="select-midi-device"
              value={selectedDevice}
              label="Select MIDI Device"
              onChange={handleChange}
            >
              {midiAccess && Array.from(midiAccess.inputs.values()).map((input, index) => (
                <MenuItem value={index} key={index}>{input.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color={isRecording ? "secondary" : "primary"} onClick={handleRecording} sx={{ mt: 2 }}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          <Button variant="contained" color="primary" onClick={saveRecording} sx={{ mt: 2 }}>
            Save as .wav
          </Button>
          <Button variant="contained" color="primary" onClick={clearRecording} sx={{ mt: 2 }}>
            Clear Recording
          </Button>
          <Button variant="contained" color="primary" onClick={playbackRecording} sx={{ mt: 2 }}>
            Playback Recording
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default MIDIComponent;
