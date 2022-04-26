import * as Tone from 'tone'
import './App.css';
import React, { useEffect } from "react";

function App() {
    
    const [polySynth, setPolySynth] = React.useState(new Tone.PolySynth().toDestination()) ;
    const [polySynthOptions, updatePolySynthOptions] = React.useReducer(
        (polySynthOptions, updates) => ({
            ...polySynthOptions,
            ...updates,
        }),
        {
        volume: -10,
        detune: 0,
        harmonicity: 1,
        modulationIndex: 0, 
        oscillator: {type: 'triangle'}, 
        envelope: {attack: 0.01, decay: 0.01, sustain: 1, release: 0.5}, 
        modulation: {type: 'square'}, 
        modulationEnvelope: {attack: 0.5, decay: 0.0, sustain: 1, release: 0.5}
        });
    const [octave, setOctave] = React.useState(0);
    const octaveRef = React.useRef(octave);
    // const [filter, setFilter] = useState(new Tone.Filter());
    // const [reverb, setReverb] = useState(new Tone.Reverb());
    // const [delay, setDelay] = useState(new Tone.FeedbackDelay());
    // const [chorus, setChorus] = useState(new Tone.Chorus());

    console.log("rerendered");
    // TODO: visualize waveform
    let waveForm = new Tone.Waveform().toDestination();
    let mouseIsDown = false;

    // update the synth options when slider changes
    const handleOscChange = (e) => {
        const waves = ["sine", "square", "sawtooth", "triangle"];
        let wave = waves[e.target.value];
        updatePolySynthOptions(
            {
            oscillator: {
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
        polySynth.triggerAttack(note, Tone.now());
        if (key.classList.contains("white")) {
            key.classList.add("white-highlighted");
        } else {
            key.classList.add("black-highlighted");
        }
    }

    const releaseNote = (key) => {
        let note = key.dataset.note + (octaveRef.current + parseInt(key.dataset.octave)).toString();
        polySynth.triggerRelease(note, Tone.now());
        // triggerRelease twice to fix bug relating to triggering release on keydown.
        polySynth.triggerRelease(note, Tone.now());
        if (key.classList.contains("white")) {
            key.classList.remove("white-highlighted");
        } else {
            key.classList.remove("black-highlighted");
        }
    }

    // update the octave reference when the octave changes
    React.useEffect(() => {
        polySynth.releaseAll(Tone.now());
        octaveRef.current = octave;
        console.log(octaveRef.current + "octaveRef");
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

    // create a new synth when options change
    useEffect(() => {
        setPolySynth(polySynth => {
            polySynth.set({
                volume: polySynthOptions.volume,
                detune: polySynthOptions.detune,
                harmonicity: polySynthOptions.harmonicity,
                modulationIndex: polySynthOptions.modulationIndex,
                oscillator: polySynthOptions.oscillator,
                envelope: polySynthOptions.envelope,
                modulation: polySynthOptions.modulation,
                modulationEnvelope: polySynthOptions.modulationEnvelope
            });
            return polySynth;
        });
    }, [polySynthOptions,]);

    return (
        <div className="App">
            <div id="synth-container">
                <div className="controls">
                    <div className="control-container">
                        <div className="control-label">OSC</div>
                        <div className="control-row">
                            <input onChange={handleOscChange} id="osc-range" type="range" min="0" max="3" defaultValue={3}/>
                        </div>
                        <div className="control-row">
                            <div>Waveform </div>
                            <div class="display">{polySynthOptions.oscillator.type}</div>
                        </div>
                        <div className="control-row">
                            <input onChange={handleOctaveChange} id="octave" type="range" min="0" max="2" defaultValue={0}/>
                        </div>
                        <div className="control-row">
                            <div>Octave</div>
                            <div class="display" id="octaveVal">{octave}</div>
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
