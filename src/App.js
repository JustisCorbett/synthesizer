import * as Tone from 'tone'
import './App.css';
import {useState} from 'react'

function App() {
    const [polySynth, setPolySynth] = useState(new Tone.PolySynth());
    const [osc, setOsc] = useState(new Tone.OmniOscillator());
    const [envelope, setEnvelope] = useState(new Tone.AmplitudeEnvelope());
    const [filter, setFilter] = useState(new Tone.Filter());
    const [reverb, setReverb] = useState(new Tone.Reverb());
    const [delay, setDelay] = useState(new Tone.FeedbackDelay());
    const [chorus, setChorus] = useState(new Tone.Chorus());
    const [octave, setOctave] = useState(3);
    return (
        <div className="App">
      
        </div>
    );
}

export default App;
