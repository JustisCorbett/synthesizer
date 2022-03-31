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
            <div id="keyboard">
                <div class="key white c" data-note="C3">
                </div>
                <div class="key black c_sharp" data-note="C#3">
                </div>
                <div class="key white d" data-note="D3">
                </div>
                <div class="key black d_sharp" data-note="D#3">
                </div>
                <div class="key white e" data-note="E3">
                </div>
                <div class="key white f" data-note="F3">
                </div>
                <div class="key black f_sharp" data-note="F#3">
                </div>
                <div class="key white g" data-note="G3">
                </div>
                <div class="key black g_sharp" data-note="G#3">
                </div>
                <div class="key white a" data-note="A3">
                </div>
                <div class="key black a_sharp" data-note="A#3">
                </div>
                <div class="key white b" data-note="B3">
                </div>
                <div class="key white c" data-note="C4">
                </div>
                <div class="key black c_sharp" data-note="C#4">
                </div>
                <div class="key white d" data-note="D4">
                </div>
                <div class="key black d_sharp" data-note="D#4">
                </div>
                <div class="key white e" data-note="E4">
                </div>
                <div class="key white f" data-note="F4">
                </div>
                <div class="key black f_sharp" data-note="F#4">
                </div>
                <div class="key white g" data-note="G4">
                </div>
                <div class="key black g_sharp" data-note="G#4">
                </div>
                <div class="key white a" data-note="A4">
                </div>
                <div class="key black a_sharp" data-note="A#4">
                </div>
                <div class="key white b" data-note="B4">
                </div>
                <div class="key white c" data-note="C5">
                </div>
                <div class="key black c_sharp" data-note="C#5">
                </div>
                <div class="key white d" data-note="D5">
                </div>
                <div class="key black d_sharp" data-note="D#5">
                </div>
                <div class="key white e" data-note="E5">
                </div>
                <div class="key white f" data-note="F5">
                </div>
                <div class="key black f_sharp" data-note="F#5">
                </div>
                <div class="key white g" data-note="G5">
                </div>
                <div class="key black g_sharp" data-note="G#5">
                </div>
                <div class="key white a" data-note="A5">
                </div>
                <div class="key black a_sharp" data-note="A#5">
                </div>
                <div class="key white b" data-note="B5">
                </div>
            </div>
        </div>
    );
}

export default App;
