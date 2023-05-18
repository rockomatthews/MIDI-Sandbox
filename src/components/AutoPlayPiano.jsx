import { useEffect, useCallback, useRef } from "react";
import JZZ from 'jzz';
import "JZZ.synth.Tiny";
import "JZZ.input.Kbd";

const AutoPlayPiano = () => {
  const pianoRef = useRef();

  useEffect(() => {
    JZZ.synth.Tiny.register('Web Audio');
    pianoRef.current = JZZ.input.Kbd({ at:'piano', active:false }).connect(JZZ().openMidiOut());
  }, []);

  const play = useCallback(() => {
    JZZ.util.iosSound();
    pianoRef.current.noteOn(0, 'C5', 120).wait(300).noteOff(0, 'C5')
         .noteOn(0, 'E5', 100).wait(300).noteOff(0, 'E5')
         .noteOn(0, 'G5', 100).wait(300).noteOff(0, 'G5')
         .noteOn(0, 'C6', 120).wait(300).noteOff(0, 'C6')
         .noteOn(0, 'G5', 100).wait(300).noteOff(0, 'G5')
         .noteOn(0, 'E5', 100).wait(300).noteOff(0, 'E5')
         .noteOn(0, 'C5', 120).wait(500).noteOff(0, 'C5');
  }, []);

  return (
    <div>
      <h1>AutoPlay</h1>
      <div id="piano"></div>
      <button onClick={play}>Play!</button>
    </div>
  );
};

export default AutoPlayPiano;
