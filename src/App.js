import * as Tone from 'tone'
import './App.css';
import React, { useEffect } from "react";
//import { Context } from 'tone';

const delay = new Tone.FeedbackDelay("8n", 0.5).toDestination();
const chorus = new Tone.Chorus(4, 10, 0.1).toDestination().start();
const reverb = new Tone.Reverb().toDestination();
//const filter = React.useRef(new Tone.Filter(440, "lowpass").toDestination());
const polySynth = new Tone.PolySynth()
    .connect(delay)
    .connect(reverb)
    .connect(chorus)
    .toDestination();

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
                case "delayTime":
                    return {
                        ...state,
                        delayTime: action.payload
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
            wet: 0
        });

    const [reverbOptions, updateReverbOptions] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "wet":
                    return {
                        ...state,
                        wet: action.payload
                    }
                case "decay":
                    return {
                        ...state,
                        decay: action.payload
                    }
                default:
                    return state
            }
        },
        {
            wet: 0,
            decay: 2.5
        });

    const [chorusOptions, updateChorusOptions] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "wet":
                    return {
                        ...state,
                        wet: action.payload
                    }
                case "depth":
                    return {
                        ...state,
                        depth: action.payload
                    }
                case "frequency":
                    return {
                        ...state,
                        frequency: action.payload
                    }
                case "delayTime":
                    return {
                        ...state,
                        delayTime: action.payload
                    }
                default:
                    return state
            }
        },
        {
            wet: 0,
            depth: 0.5,
            frequency: 4,
            delayTime: 2.5
        });


    const [octave, setOctave] = React.useState(3);
    const octaveRef = React.useRef(3);
    const [activeVoices, setActiveVoices] = React.useState(polySynth.activeVoices);
    
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
        let keyboard = document.getElementById("keyboard");

        const playNote = (key) => {
            // need to use a ref to keep track of octave because the state is not updating
            let note = key.dataset.note + (octaveRef.current + parseInt(key.dataset.octave)).toString();
            polySynth.triggerRelease(note, Tone.now());
            polySynth.triggerAttack(note, Tone.now());
            if (key.classList.contains("white")) {
                key.classList.add("white-highlighted");
            } else {
                key.classList.add("black-highlighted");
            }
            setActiveVoices(polySynth.activeVoices);
            console.log(polySynth.activeVoices);
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
            setActiveVoices(polySynth.activeVoices);
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
                    setOctave(0);
                    break;
                case "1":
                    setOctave(3);
                    break;
                case "2":
                    setOctave(5);
                    break;
                default :
                    setOctave(0);
            };
        }

        const handleVolumeChange = (e) => {
            updatePolySynthOptions(
                {
                type: "synth",
                payload: {
                    volume: e.target.value
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
                type: "delayTime",
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

    // set up event listeners for reverb option changes, and update reverb options
    React.useEffect(() => {
        let reverbDecayRange = document.getElementById("reverb-decay-range");
        let reverbWetRange = document.getElementById("reverb-wet-range");

        const handleReverbDecayChange = (e) => {
            updateReverbOptions(
                {
                type: "decay",
                payload: parseInt(e.target.value) / 100
            });
        }

        const handleReverbWetChange = (e) => {
            updateReverbOptions(
                {
                type: "wet",
                payload: parseInt(e.target.value) / 100
            });
        }

        reverbDecayRange.addEventListener("change", handleReverbDecayChange);
        reverbWetRange.addEventListener("change", handleReverbWetChange);

        return () => {
            reverbDecayRange.removeEventListener("change", handleReverbDecayChange);
            reverbWetRange.removeEventListener("change", handleReverbWetChange);
        }

    }, [])

    // set up event listeners for chorus option changes, and update chorus options
    React.useEffect(() => {
        let chorusDelayRange = document.getElementById("chorus-delay-range");
        let chorusWetRange = document.getElementById("chorus-wet-range");
        let chorusFrequencyRange = document.getElementById("chorus-frequency-range");
        let chorusDepthRange = document.getElementById("chorus-depth-range");

        const handleChorusDelayChange = (e) => {
            updateChorusOptions(
                {
                type: "delayTime",
                payload: parseInt(e.target.value) / 10
            });
        }

        const handleChorusWetChange = (e) => {
            updateChorusOptions(
                {
                type: "wet",
                payload: parseInt(e.target.value) / 100
            });
        }

        const handleChorusFrequencyChange = (e) => {
            updateChorusOptions(
                {
                type: "frequency",
                payload: parseInt(e.target.value) / 10
            });
        }

        const handleChorusDepthChange = (e) => {
            updateChorusOptions(
                {
                type: "depth",
                payload: parseInt(e.target.value) / 100
            });
        }

        chorusDelayRange.addEventListener("change", handleChorusDelayChange);
        chorusWetRange.addEventListener("change", handleChorusWetChange);
        chorusFrequencyRange.addEventListener("change", handleChorusFrequencyChange);
        chorusDepthRange.addEventListener("change", handleChorusDepthChange);

        return () => {
            chorusDelayRange.removeEventListener("change", handleChorusDelayChange);
            chorusWetRange.removeEventListener("change", handleChorusWetChange);
            chorusFrequencyRange.removeEventListener("change", handleChorusFrequencyChange);
            chorusDepthRange.removeEventListener("change", handleChorusDepthChange);
        }

    }, [])


    // set octave state
    React.useEffect(() => {
        polySynth.releaseAll();
        octaveRef.current = octave;
    }, [octave, ])

    // clear global context and connect nodes to new audio context
    // React.useEffect(() => {
    //     let context = Tone.getContext();
    //     console.log(context);
    //     setTimeout(function() { 
    //         context.dispose();
    //      }, 100);  
    //     //context.dispose();
    //     Tone.setContext(new Context());
    //     // polySynth.current.releaseAll();
    //     // delay.current.toDestination();
    //     // reverb.current.toDestination();
    //     // chorus.current.toDestination();
    //     // polySynth.current
    //     //     .connect(delay.current)
    //     //     .connect(reverb.current)
    //     //     .connect(chorus.current);

    // }, [polySynthOptions, delayOptions, reverbOptions, chorusOptions])


    // create new synth with updated synth options
    useEffect(() => {
        polySynth.releaseAll(Tone.now());
        console.log(polySynth);
        console.log(Tone.getContext());
        console.log(Tone.getDestination())
        //polySynth.current.dispose();
        //polySynth.current = new Tone.PolySynth()
        //   .connect(delay.current)
        //   .connect(reverb.current)
        //   .connect(chorus.current);
        polySynth.set({
            volume: polySynthOptions.volume,
            detune: polySynthOptions.detune,
            oscillator: polySynthOptions.oscillator,
            envelope: polySynthOptions.envelope,
        });
    }, [polySynthOptions, ]);

    // create new delay with updated delay options
    useEffect(() => {
        polySynth.releaseAll(Tone.now());
        //delay.current.dispose();
        //delay.current = new Tone.FeedbackDelay().toDestination();
        delay.set({
            delayTime: delayOptions.delayTime,
            feedback: delayOptions.feedback,
            wet: delayOptions.wet
        });
        //polySynth.current.connect(delay.current);
    }, [delayOptions,]);

    // create new reverb with updated reverb options
    useEffect(() => {
        polySynth.releaseAll(Tone.now());
        //reverb.current.dispose();
        //reverb.current = new Tone.Reverb().toDestination();
        reverb.set({
            decay: reverbOptions.decay,
            wet: reverbOptions.wet
        });
        //polySynth.current.connect(reverb.current);
    }, [reverbOptions,]);

    // create new chorus with updated chorus options
    useEffect(() => {
        polySynth.releaseAll(Tone.now());
        //chorus.current.stop();
        //chorus.current.dispose();
        //chorus.current = new Tone.Chorus().toDestination().start();
        chorus.set({
            frequency: chorusOptions.frequency,
            delayTime: chorusOptions.delayTime,
            depth: chorusOptions.depth,
            wet: chorusOptions.wet
        });
        //polySynth.current.connect(chorus.current);
    }, [chorusOptions,]);


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
                                        <input id="volume-range" type="range" min="-50" max="0" defaultValue={polySynthOptions.volume}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Volume</div>
                                        <div className="display">{polySynthOptions.volume}db</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="octave-range" type="range" min="0" max="2" defaultValue={1}/>
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
                                    <div className="control-row">
                                        <div>Active Voices</div>
                                        <div className="display">{activeVoices}/32</div>
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
                                        <div className="display">{polySynthOptions.envelope.attack}s</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="decay-range" type="range" min="10" max="500" step={10} defaultValue={polySynthOptions.envelope.decay * 10}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Decay</div>
                                        <div className="display">{polySynthOptions.envelope.decay}s</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="sustain-range" type="range" min="0" max="100" step={10} defaultValue={polySynthOptions.envelope.sustain * 100}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Sustain</div>
                                        <div className="display">{polySynthOptions.envelope.sustain * 100}%</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="release-range" type="range" min="10" max="500" step={10} defaultValue={polySynthOptions.envelope.release * 10}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Release</div>
                                        <div className="display">{polySynthOptions.envelope.release}s</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="control-container">
                            <div className="control-label">Delay</div>
                            <div className="control-main-row">
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="delay-time-range" type="range" min="10" max="100" step={10} defaultValue={delayOptions.delayTime * 100}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Time</div>
                                        <div className="display">{delayOptions.delayTime}s</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="delay-feedback-range" type="range" min="10" max="100" step={10} defaultValue={delayOptions.feedback * 100}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Feedback</div>
                                        <div className="display">{delayOptions.feedback * 100}%</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="delay-wet-range" type="range" min="0" max="100" step={10} defaultValue={delayOptions.wet * 100}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Wet</div>
                                        <div className="display">{delayOptions.wet * 100}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="control-container">
                            <div className="control-label">Reverb</div>
                            <div className="control-main-row">
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="reverb-decay-range" type="range" min="10" max="1000" step={10} defaultValue={reverbOptions.decay * 100}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Size</div>
                                        <div className="display">{reverbOptions.decay}s</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="reverb-wet-range" type="range" min="0" max="100" step={10} defaultValue={reverbOptions.wet * 100}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Wet</div>
                                        <div className="display">{reverbOptions.wet * 100}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="control-container">
                            <div className="control-label">Chorus</div>
                            <div className="control-main-row">
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="chorus-depth-range" type="range" min="0" max="100" step={10} defaultValue={chorusOptions.depth * 100}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Depth</div>
                                        <div className="display">{chorusOptions.depth * 100}%</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="chorus-delay-range" type="range" min="1" max="50" step={1} defaultValue={chorusOptions.delayTime * 10}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Delay</div>
                                        <div className="display">{chorusOptions.delayTime}ms</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="chorus-frequency-range" type="range" min="1" max="100" step={1} defaultValue={chorusOptions.frequency * 10}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Frequency</div>
                                        <div className="display">{chorusOptions.frequency}hz</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="chorus-wet-range" type="range" min="0" max="100" step={10} defaultValue={chorusOptions.wet * 100}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Wet</div>
                                        <div className="display">{chorusOptions.wet * 100}%</div>
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
