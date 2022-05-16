import * as Tone from 'tone'
import './App.css';
import React, { useEffect } from "react";

function App() {
    
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
            volume: -24,
            detune: 0, 
            oscillator: {type: 'fatsine', count: 1, spread: 10}, 
            envelope: {attack: 0.1, decay: 0.1, sustain: 1, release: 0.5}, 
        });

    const [delayOptions, updateDelayOptions] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "time":
                    return {
                        ...state,
                        time: action.payload
                    }
                case "feedback":
                    return {
                        ...state,
                        feedback: action.payload
                    }
                case "wet":
                    return {
                        ...state,
                        wet: action.payload
                    }
                default:
                    return state
            }
        },
        {
            delayTime: 0.5,
            feedback: 0.5,
            wet: 0.5
        });


    //const [octave, setOctave] = React.useState(0);
    const octaveRef = React.useRef(0);
    const delay = React.useRef(new Tone.FeedbackDelay("8n", 0.5).toDestination());
    //const chorus = React.useRef(new Tone.Chorus(4, 2.5, 0.5).start().toDestination());
    //const reverb = React.useRef(new Tone.Freeverb(0.5, 0.5).toDestination());
    const volume = React.useRef(new Tone.Volume(0).toDestination());
    //const filter = React.useRef(new Tone.Filter(440, "lowpass").toDestination());
    const polySynth = React.useRef(new Tone.PolySynth().toDestination());
    // const [filter, setFilter] = useState(new Tone.Filter());
    // const [reverb, setReverb] = useState(new Tone.Reverb());
    // const [delay, setDelay] = useState(new Tone.FeedbackDelay());
    // const [chorus, setChorus] = useState(new Tone.Chorus());

    // TODO: visualize waveform
    //let waveForm = new Tone.Waveform().toDestination();
    

    

    

    

    // const handleDelayTimeChange = (e) => {
    //     delay.current.delayTime.value = parseInt(e.target.value);
    // }

    // const handleDelayFeedbackChange = (e) => {
    //     delay.current.feedback.value = parseInt(e.target.value) / 100;
    // }

    // const handleDelayWetChange = (e) => {
    //     delay.current.wet.value = parseInt(e.target.value) / 100;
    // }

    

    // update the octave reference when the octave changes
    // React.useEffect(() => {
    //     polySynth.current.releaseAll(Tone.now());
    //     octaveRef.current = octave;
    // }, [octave]);

    // set up listeners for playing notes
    React.useEffect(() => {
        let keyboard = document.querySelector(".keyboard");

        const playNote = (key) => {
            // need to use a ref to keep track of octave because the state is not updating
            let note = key.dataset.note + (octaveRef.current + parseInt(key.dataset.octave)).toString();
            polySynth.current.triggerRelease(note, Tone.now());
            polySynth.current.triggerAttack(note, Tone.now());
            console.log(polySynth.current.activeVoices);
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

        const handleKeyDown = (e) => {
            let key = keyboard.querySelector(`[data-key="${e.key}"]`);
            if (key !== null && e.repeat !== true) {
                playNote(key);
            }
        }
    
        const handleKeyUp = (e) => {
            let key = keyboard.querySelector(`[data-key="${e.key}"]`);
            if (key !== null) {
                releaseNote(key);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        
        for(let key of keyboard.children){
            key.addEventListener("mousedown",  function(){playNote(key)});
            key.addEventListener("touchstart", function(){playNote(key)                 });
            key.addEventListener("mouseleave", function(){releaseNote(key)              });
            key.addEventListener("mouseup",    function(){releaseNote(key)});
            key.addEventListener("touchend",   function(){releaseNote(key)              });
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);

            for(let key of keyboard.children){
                
                key.removeEventListener("mousedown",  function(){playNote(key)});
                key.removeEventListener("touchstart", function(){playNote(key)                 });
                key.removeEventListener("mouseleave", function(){releaseNote(key)              });
                key.removeEventListener("mouseup",    function(){releaseNote(key)});
                key.removeEventListener("touchend",   function(){releaseNote(key)              });
            }
        }
    }, []);

    // set up event listeners for oscillator options, and update the oscillator options
    React.useEffect(() => {

        let octaveRange = document.getElementById("octave-range");
        let volumeRange = document.getElementById("volume-range");
        let oscRange = document.getElementById("osc-range");
        let spreadRange = document.getElementById("spread-range");
        let attackRange = document.getElementById("attack-range");
        let decayRange = document.getElementById("decay-range");
        let sustainRange = document.getElementById("sustain-range");
        let releaseRange = document.getElementById("release-range");
        let countRange = document.getElementById("count-range");

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
                    //setOctave(octave => {octave = 0; return octave});
                    octaveRef.current = 0;
                    break;
                case "1":
                    //setOctave(octave => {octave = 3; return octave});
                    octaveRef.current = 3;
                    break;
                case "2":
                    //setOctave(octave => {octave = 5; return octave});
                    octaveRef.current = 5;
                    break;
                default :
                    //setOctave(octave => 0);
                    octaveRef.current = 0;
            };
        }

        const handleVolumeChange = (e) => {
            volume.current.set({
                volume : e.target.value
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
                    attack: parseInt(e.target.value) / 100
                }
            });
        }
    
        const handleDecayChange = (e) => {
            updatePolySynthOptions(
                {
                type: "envelope",
                payload: {
                    decay: parseInt(e.target.value) / 100
                }
            });
        }
    
        const handleSustainChange = (e) => {
            updatePolySynthOptions(
                {
                type: "envelope",
                payload: {
                    sustain: parseInt(e.target.value) / 100
                }
            });
        }
    
        const handleReleaseChange = (e) => {
            updatePolySynthOptions(
                {
                type: "envelope",
                payload: {
                    release: parseInt(e.target.value) / 100
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

        octaveRange.addEventListener("change", handleOctaveChange);
        volumeRange.addEventListener("change", handleVolumeChange);
        oscRange.addEventListener("change", handleOscChange);
        spreadRange.addEventListener("change", handleSpreadChange);
        attackRange.addEventListener("change", handleAttackChange);
        decayRange.addEventListener("change", handleDecayChange);
        sustainRange.addEventListener("change", handleSustainChange);
        releaseRange.addEventListener("change", handleReleaseChange);
        countRange.addEventListener("change", handleCountChange);

        return () => {
            octaveRange.removeEventListener("change", handleOctaveChange);
            volumeRange.removeEventListener("change", handleVolumeChange);
            oscRange.removeEventListener("change", handleOscChange);
            spreadRange.removeEventListener("change", handleSpreadChange);
            attackRange.removeEventListener("change", handleAttackChange);
            decayRange.removeEventListener("change", handleDecayChange);
            sustainRange.removeEventListener("change", handleSustainChange);
            releaseRange.removeEventListener("change", handleReleaseChange);
            countRange.removeEventListener("change", handleCountChange);
        }

    }, [])

    // set up event listeners for delay option changes, and update delay options
    React.useEffect(() => {
        let delayTimeRange = document.getElementById("delay-time-range");
        let delayFeedbackRange = document.getElementById("delay-feedback-range");
        let delayWetRange = document.getElementById("delay-wet-range");

        const handleDelayTimeChange = (e) => {
            updateDelayOptions(
                {
                type: "time",
                payload: parseInt(e.target.value) / 100
            });
        }
        
        const handleDelayFeedbackChange = (e) => {
            updateDelayOptions(
                {
                type: "feedback",
                payload: parseInt(e.target.value) / 100
            });
        }

        const handleDelayWetChange = (e) => {
            updateDelayOptions(
                {
                type: "wet",
                payload: parseInt(e.target.value) / 100
            });
        }

        delayTimeRange.addEventListener("change", handleDelayTimeChange);
        delayFeedbackRange.addEventListener("change", handleDelayFeedbackChange);
        delayWetRange.addEventListener("change", handleDelayWetChange);

        return () => {
            delayTimeRange.removeEventListener("change", handleDelayTimeChange);
            delayFeedbackRange.removeEventListener("change", handleDelayFeedbackChange);
            delayWetRange.removeEventListener("change", handleDelayWetChange);
        }

    }, [])


    // create new synth with updated synth options
    useEffect(() => {
        polySynth.current.releaseAll(Tone.now());
        polySynth.current.dispose();
        polySynth.current = new Tone.PolySynth().toDestination();
        polySynth.current.set({
            volume: polySynthOptions.volume,
            detune: polySynthOptions.detune,
            oscillator: polySynthOptions.oscillator,
            envelope: polySynthOptions.envelope,
        });
    }, [polySynthOptions,]);

    // create new delay with updated delay options
    useEffect(() => {
        delay.current.dispose();
        delay.current = new Tone.FeedbackDelay(delayOptions.delayTime, delayOptions.feedback).toDestination();
        delay.current.set({
            wet: delayOptions.wet
        });
    }, [delayOptions,]);

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
                                        <input id="volume-range" type="range" min="-50" max="0" defaultValue={volume.current.volume.value}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Volume</div>
                                        <div className="display">{volume.current.volume.value}</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="octave-range" type="range" min="0" max="2" defaultValue={0}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Octave</div>
                                        <div className="display" id="octaveVal">{octaveRef.current}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="control-container">
                            <div className="control-label">OSC</div>
                            <div className="control-main-row">
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="osc-range" type="range" min="0" max="3" defaultValue={0}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Waveform </div>
                                        <div className="display">{polySynthOptions.oscillator.type.slice(3)}</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="count-range" type="range" min="1" max="3" step={1} defaultValue={polySynthOptions.oscillator.count}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Count</div>
                                        <div className="display">{polySynthOptions.oscillator.count}</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="spread-range" type="range" min="1" max="100" step={1} defaultValue={polySynthOptions.oscillator.spread}/>
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
                                        <input id="attack-range" type="range" min="0" max="500" step={10} defaultValue={polySynthOptions.envelope.attack * 10}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Attack</div>
                                        <div className="display">{polySynthOptions.envelope.attack}</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="decay-range" type="range" min="10" max="500" step={10} defaultValue={polySynthOptions.envelope.decay * 10}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Decay</div>
                                        <div className="display">{polySynthOptions.envelope.decay}</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="sustain-range" type="range" min="10" max="100" step={10} defaultValue={polySynthOptions.envelope.sustain * 100}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Sustain</div>
                                        <div className="display">{polySynthOptions.envelope.sustain}</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="release-range" type="range" min="0" max="500" step={10} defaultValue={polySynthOptions.envelope.release * 10}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Release</div>
                                        <div className="display">{polySynthOptions.envelope.release}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="control-container">
                            <div className="control-label">Delay</div>
                            <div className="control-main-row">
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="delay-time-range" type="range" min="10" max="500" step={10} defaultValue={delayOptions.time * 10}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Attack</div>
                                        <div className="display">{polySynthOptions.envelope.attack}</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="delay-feed-range" type="range" min="10" max="500" step={10} defaultValue={delayOptions.feedback * 10}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Decay</div>
                                        <div className="display">{polySynthOptions.envelope.decay}</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="delay-wet-range" type="range" min="10" max="100" step={10} defaultValue={delayOptions.wet * 100}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Sustain</div>
                                        <div className="display">{polySynthOptions.envelope.sustain}</div>
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
