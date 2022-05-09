import * as Tone from 'tone'
import './App.css';
import React, { useEffect } from "react";

function App() {
    
    //const [polySynth, setPolySynth] = React.useState(new Tone.PolySynth().toDestination()) ;
    const [polySynthOptions, updatePolySynthOptions] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "synth":
                    return {
                        ...state,
                        ...action.payload
                    }
                case "oscillator":
                    return {
                        ...state,
                        oscillator: {
                            ...state.oscillator,
                            ...action.payload
                        }
                    }
                case "envelope":
                    return {
                        ...state,
                        envelope: {
                            ...state.envelope,
                            ...action.payload
                        }
                    }
                default:
                    return state
            }
        },
        {
            volume: -10,
            detune: 0, 
            oscillator: {type: 'fatsine', count: 1, spread: 10}, 
            envelope: {attack: 0.1, decay: 0.1, sustain: 1, release: 0.5}, 
        });

    const [octave, setOctave] = React.useState(0);
    const octaveRef = React.useRef(octave);
    const polySynth = React.useRef(new Tone.PolySynth().toDestination());
    // const [filter, setFilter] = useState(new Tone.Filter());
    // const [reverb, setReverb] = useState(new Tone.Reverb());
    // const [delay, setDelay] = useState(new Tone.FeedbackDelay());
    // const [chorus, setChorus] = useState(new Tone.Chorus());

    // TODO: visualize waveform
    let waveForm = new Tone.Waveform().toDestination();
    let mouseIsDown = false;

    // update the synth options when slider changes
    const handleOscChange = (e) => {
        const waves = ["fatsine", "fatsquare", "fatsawtooth", "fattriangle"];
        let wave = waves[e.target.value];
        updatePolySynthOptions(
            {
            type: "oscillator",
            payload: {
                type: wave
            }
        });
    }

    // change octave state when slider is moved
    const handleOctaveChange = (e) => {
        const selection = e.target.value;
        switch (selection) {
            case "0":
                setOctave(octave => {octave = 0; return octave});
                break;
            case "1":
                setOctave(octave => {octave = 3; return octave});
                break;
            case "2":
                setOctave(octave => {octave = 5; return octave});
                break;
            default :
                setOctave(octave => 0);
        };
    }

    const handleVolumeChange = (e) => {
        updatePolySynthOptions(
            {
            type: "synth",
            payload: {
                volume: parseInt(e.target.value)
            }
        });
    }

    const handleSpreadChange = (e) => {
        updatePolySynthOptions(
            {
            type: "oscillator",
            payload: {
                spread: parseInt(e.target.value)
            }
        });
    }

    const handleAttackChange = (e) => {
        updatePolySynthOptions(
            {
            type: "envelope",
            payload: {
                attack: parseInt(e.target.value)
            }
        });
    }

    const handleDecayChange = (e) => {
        updatePolySynthOptions(
            {
            type: "envelope",
            payload: {
                decay: parseInt(e.target.value)
            }
        });
    }

    const handleSustainChange = (e) => {
        updatePolySynthOptions(
            {
            type: "envelope",
            payload: {
                sustain: parseInt(e.target.value)
            }
        });
    }

    const handleReleaseChange = (e) => {
        updatePolySynthOptions(
            {
            type: "envelope",
            payload: {
                release: parseInt(e.target.value)
            }
        });
    }

    const handleCountChange = (e) => {
        updatePolySynthOptions(
            {
            type: "oscillator",
            payload: {
                count: parseInt(e.target.value)
            }
        });
    }

    const handleMouseDown = (bool) => {
        mouseIsDown = bool;
    }

    const handleKeyDown = (e, keyboard) => {
        let key = keyboard.querySelector(`[data-key="${e.key}"]`);
        if (key !== null) {
            playNote(key);
        }
    }

    const playNote = (key) => {
        // need to use a ref to keep track of octave because the state is not updating
        let note = key.dataset.note + (octaveRef.current + parseInt(key.dataset.octave)).toString();
        Tone.start();
        polySynth.current.triggerRelease(note, Tone.now());
        polySynth.current.triggerAttack(note, Tone.now());
        if (key.classList.contains("white")) {
            key.classList.add("white-highlighted");
        } else {
            key.classList.add("black-highlighted");
        }
    }

    const releaseNote = (key) => {
        let note = key.dataset.note + (octaveRef.current + parseInt(key.dataset.octave)).toString();
        polySynth.current.triggerRelease(note, Tone.now());
        // triggerRelease twice to fix bug relating to triggering release on keydown.
        polySynth.current.triggerRelease(note, Tone.now());
        if (key.classList.contains("white")) {
            key.classList.remove("white-highlighted");
        } else {
            key.classList.remove("black-highlighted");
        }
    }

    // update the octave reference when the octave changes
    React.useEffect(() => {
        polySynth.current.releaseAll(Tone.now());
        octaveRef.current = octave;
    }, [octave]);

    // set up event listeners after the component mounts
    React.useEffect(() => {
        let keyboard = document.getElementById("keyboard");

        window.addEventListener("keydown", function(e){
            let key = keyboard.querySelector(`[data-key="${e.key}"]`);
            if (key !== null && e.repeat !== true) {
                playNote(key);
            }
        });
        window.addEventListener("keyup", function(e){
            let key = keyboard.querySelector(`[data-key="${e.key}"]`);
            if (key !== null) {
                releaseNote(key);
            }
        });
        keyboard.ondragstart = function(){return(false)};
        keyboard.addEventListener("mousedown", handleMouseDown(true));
        keyboard.addEventListener("mouseup",   handleMouseDown(false));
        
        for(let key of keyboard.children){
            key.addEventListener("mouseover",  function(){if(mouseIsDown) playNote(key)});
            key.addEventListener("mousedown",  function(){playNote(key); handleMouseDown(true)});
            key.addEventListener("touchstart", function(){playNote(key)                 });
            key.addEventListener("mouseleave", function(){releaseNote(key)              });
            key.addEventListener("mouseup",    function(){releaseNote(key); handleMouseDown(false)});
            key.addEventListener("touchend",   function(){releaseNote(key)              });
        }
    }, [])

    // set synth options when options change
    useEffect(() => {
        polySynth.current.dispose();
        polySynth.current = new Tone.PolySynth().toDestination();
        polySynth.current.set({
            volume: polySynthOptions.volume,
            detune: polySynthOptions.detune,
            oscillator: polySynthOptions.oscillator,
            envelope: polySynthOptions.envelope,
        });
    }, [polySynthOptions,]);

    return (
        <div className="App">
            <div id="synth-container">
                <div className="top-container">
                    <div className="main-label">
                        <div>PolyRetro</div>
                        <div className="sub-label">Created by Justis Corbett</div>
                    </div>
                    <div className="controls">
                        <div className="control-container">
                            <div className="control-label">Master</div>
                            <div className="control-main-row">
                                <div className="control-col">
                                    <div className="control-row">
                                        <input onChange={handleVolumeChange} id="vol-range" type="range" min="-50" max="0" defaultValue={polySynthOptions.volume}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Volume</div>
                                        <div className="display">{polySynthOptions.volume}</div>
                                    </div>
                                    <div className="control-row">
                                        <input onChange={handleOctaveChange} id="octave" type="range" min="0" max="2" defaultValue={0}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Octave</div>
                                        <div className="display" id="octaveVal">{octave}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="control-container">
                            <div className="control-label">OSC</div>
                            <div className="control-main-row">
                                <div className="control-col">
                                    <div className="control-row">
                                        <input onChange={handleOscChange} id="osc-range" type="range" min="0" max="3" defaultValue={0}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Waveform </div>
                                        <div className="display">{polySynthOptions.oscillator.type.slice(3)}</div>
                                    </div>
                                    <div className="control-row">
                                        <input onChange={handleCountChange} id="count-range" type="range" min="1" max="5" step={1} defaultValue={polySynthOptions.oscillator.count}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Count</div>
                                        <div className="display">{polySynthOptions.oscillator.count}</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input onChange={handleSpreadChange} id="spread-range" type="range" min="1" max="100" step={1} defaultValue={polySynthOptions.oscillator.spread}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Spread</div>
                                        <div className="display">{polySynthOptions.oscillator.spread}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="control-container">
                            <div className="control-label">ENV</div>
                            <div className="control-main-row">
                                <div className="control-col">
                                    <div className="control-row">
                                        <input onChange={handleAttackChange} id="attack-range" type="range" min="0" max="5" step="0.1" defaultValue={polySynthOptions.envelope.attack}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Attack</div>
                                        <div className="display">{polySynthOptions.envelope.attack}</div>
                                    </div>
                                    <div className="control-row">
                                        <input onChange={handleDecayChange} id="count-range" type="range" min="0.1" max="5" step={0.1} defaultValue={polySynthOptions.envelope.decay}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Decay</div>
                                        <div className="display">{polySynthOptions.envelope.decay}</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input onChange={handleSustainChange} id="sustain-range" type="range" min="0.1" max="1" step={0.1} defaultValue={polySynthOptions.envelope.sustain}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Sustain</div>
                                        <div className="display">{polySynthOptions.envelope.sustain}</div>
                                    </div>
                                    <div className="control-row">
                                        <input onChange={handleReleaseChange} id="release-range" type="range" min="0" max="10" step={0.1} defaultValue={polySynthOptions.envelope.release}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Release</div>
                                        <div className="display">{polySynthOptions.envelope.release}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="keyboard">
                    <div className="key white c" data-note="C" data-octave="0" data-key="z">
                    </div>
                    <div className="key black c_sharp" data-note="C#" data-octave="0" data-key="s">
                    </div>
                    <div className="key white d" data-note="D" data-octave="0" data-key="x">
                    </div>
                    <div className="key black d_sharp" data-note="D#" data-octave="0" data-key="d">
                    </div>
                    <div className="key white e" data-note="E" data-octave="0" data-key="c">
                    </div>
                    <div className="key white f" data-note="F" data-octave="0" data-key="v">
                    </div>
                    <div className="key black f_sharp" data-note="F#" data-octave="0" data-key="g">
                    </div>
                    <div className="key white g" data-note="G" data-octave="0" data-key="b">
                    </div>
                    <div className="key black g_sharp" data-note="G#" data-octave="0" data-key="h">
                    </div>
                    <div className="key white a" data-note="A" data-octave="0" data-key="n">
                    </div>
                    <div className="key black a_sharp" data-note="A#" data-octave="0" data-key="j">
                    </div>
                    <div className="key white b" data-note="B" data-octave="0" data-key="m">
                    </div>
                    <div className="key white c" data-note="C" data-octave="1" data-key=",">
                    </div>
                    <div className="key black c_sharp" data-note="C#" data-octave="1" data-key="l">
                    </div>
                    <div className="key white d" data-note="D" data-octave="1" data-key=".">
                    </div>
                    <div className="key black d_sharp" data-note="D#" data-octave="1" data-key=";">
                    </div>
                    <div className="key white e" data-note="E" data-octave="1" data-key="/">
                    </div>
                    <div className="key white f" data-note="F" data-octave="1" data-key="q">
                    </div>
                    <div className="key black f_sharp" data-note="F#" data-octave="1" data-key="2">
                    </div>
                    <div className="key white g" data-note="G" data-octave="1" data-key="w">
                    </div>
                    <div className="key black g_sharp" data-note="G#" data-octave="1" data-key="3">
                    </div>
                    <div className="key white a" data-note="A" data-octave="1" data-key="e">
                    </div>
                    <div className="key black a_sharp" data-note="A#" data-octave="1" data-key="4">
                    </div>
                    <div className="key white b" data-note="B" data-octave="1" data-key="r">
                    </div>
                    <div className="key white c" data-note="C" data-octave="2" data-key="t">
                    </div>
                    <div className="key black c_sharp" data-note="C#" data-octave="2" data-key="6">
                    </div>
                    <div className="key white d" data-note="D" data-octave="2" data-key="y">
                    </div>
                    <div className="key black d_sharp" data-note="D#" data-octave="2" data-key="7">
                    </div>
                    <div className="key white e" data-note="E" data-octave="2" data-key="u">
                    </div>
                    <div className="key white f" data-note="F" data-octave="2" data-key="i">
                    </div>
                    <div className="key black f_sharp" data-note="F#" data-octave="2" data-key="9">
                    </div>
                    <div className="key white g" data-note="G" data-octave="2" data-key="o">
                    </div>
                    <div className="key black g_sharp" data-note="G#" data-octave="2" data-key="0">
                    </div>
                    <div className="key white a" data-note="A" data-octave="2" data-key="p">
                    </div>
                    <div className="key black a_sharp" data-note="A#" data-octave="2" data-key="-">
                    </div>
                    <div className="key white b" data-note="B" data-octave="2" data-key="[">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
