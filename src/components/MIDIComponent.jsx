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
  const [audioContext, setAudioContext] = useState(null);
  const [synth, setSynth] = useState(null);
  const [midiAccess, setMidiAccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('');

  const handleOpen = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const synth = new Tone.Synth().connect(audioContext.destination);
    await Tone.start();
    await audioContext.resume(); // Add this line

    setAudioContext(audioContext);
    setSynth(synth);

    console.log('audio is ready');
    setOpen(true);
  };


  const startAudioContext = async () => {
    await Tone.start();
    console.log('audio is ready');
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

    return () => {
      if (synth) {
        synth.dispose();
      }
    };
  }, []);

  return (
    <div>
      <h1>Web MIDI API Component</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{
          bgcolor: 'background.default', // set the background color
          color: 'text.primary',
          borderColor: 'text.primary', // set the border color
          '&:hover': {
            boxShadow: '0 0 10px 3px rgba(0, 123, 255, 0.5)', // add a blue glow on hover
          },
        }}
      >
        Select MIDI Device
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="select-midi-device"
        aria-describedby="select-a-midi-device-from-the-list"
      >
        <Box
          sx={{
            p: 2,  // padding
            mt: 1, // margin-top
            bgcolor: 'background.paper',
            borderRadius: 'borderRadius',
            boxShadow: 1,
          }}
        >
          <h2>Select MIDI Device</h2>
          <FormControl fullWidth>
            <InputLabel id="select-midi-device-label">MIDI Device</InputLabel>
            <Select
              labelId="select-midi-device-label"
              id="select-midi-device"
              value={selectedDevice}
              label="MIDI Device"
              onChange={handleChange}
            >
              {midiAccess && Array.from(midiAccess.inputs.values()).map((input) => (
                <MenuItem key={input.id} value={input.id}>{input.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleRecording}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          <Button variant="contained" color="primary" onClick={saveRecording}>
            Save Recording
          </Button>
          <Button variant="contained" color="primary" onClick={clearRecording}>
            Clear Recording
          </Button>
          <Button variant="contained" color="primary" onClick={playbackRecording}>
            Playback Recording
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default MIDIComponent;  
