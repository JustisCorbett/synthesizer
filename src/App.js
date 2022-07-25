import * as Tone from 'tone'
import './App.css';
import React, { useEffect, useRef, useReducer, useState } from "react";

const delay = new Tone.FeedbackDelay("8n", 0.5);
const chorus = new Tone.Chorus(4, 10, 0.1).start();
const reverb = new Tone.Reverb();
const filter = new Tone.AutoFilter().start();

const polySynth = new Tone.PolySynth()
    .chain(filter, delay, reverb, chorus, Tone.Destination);


const downloadPreset = (data) => {
    const json = JSON.stringify(data);
    const fileName = data.name;
    // Create a blob with the data we want to download as a file
    const blob = new Blob([json], {type: "text/json"})
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
}

const reader = new FileReader();

function App() {

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

    // handle delay option changes
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

    //handle reverb optioon changes
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

    // handle chorus option changes
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

    //handle filter options changes
    const handleFilterFrequencyChange = (e) => {
        updateFilterOptions(
            {
                type: "frequency",
                payload: parseInt(e.target.value) / 10
            }
        );
    }
    
    const handleFilterBaseFrequencyChange = (e) => {
        updateFilterOptions(
            {
                type: "baseFrequency",
                payload: parseInt(e.target.value)
            }
        );
    }

    const handleFilterOctavesChange = (e) => {
        updateFilterOptions(
            {
                type: "octaves",
                payload: parseInt(e.target.value)
            }
        );
    }

    const handleFilterTypeChange = (e) => {
        const waves = ["sine", "square", "sawtooth", "triangle"];
        let wave = waves[e.target.value];
        updateFilterOptions(
            {
            type: "type",
            payload: wave
        });
    }

    const handleFilterDepthChange = (e) => {
        updateFilterOptions(
            {
                type: "depth",
                payload: parseInt(e.target.value) / 10
            }
        );
    }
    
    const handleFilterWetChange = (e) => {
        updateFilterOptions(
            {
                type: "wet",
                payload: parseInt(e.target.value) / 100
            }
        );
    }
    const [isVisibles, updateIsVisibles] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "master":
                    return {
                        ...state,
                        master: action.payload
                    }
                case "oscillator":
                    return {
                        ...state,
                        oscillator: action.payload
                    }
                case "envelope":
                    return {
                        ...state,
                        envelope: action.payload
                    }
                case "filter":
                    return {
                        ...state,
                        filter: action.payload
                    }
                case "delay":
                    return {
                        ...state,
                        delay: action.payload
                    }
                case "reverb":
                    return {
                        ...state,
                        reverb: action.payload
                    }
                case "chorus":
                    return {
                        ...state,
                        chorus: action.payload
                    }
                default:
                    return state
            }
        },
        {
            master: true,
            oscillator: true,
            envelope: true,
            filter: false,
            delay: false,
            reverb: false,
            chorus: false 
        }
    );
    
    const [polySynthOptions, updatePolySynthOptions] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "REPLACE_STATE":
                    console.log("replaceing synth state")
                    return action.payload
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
            volume: -12,
            detune: 0, 
            oscillator: {type: 'fatsine', count: 1, spread: 10}, 
            envelope: {attack: 0.1, decay: 0.1, sustain: 1, release: 0.5}, 
        });

    const [delayOptions, updateDelayOptions] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "REPLACE_STATE":
                    return action.payload
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

    const [reverbOptions, updateReverbOptions] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "REPLACE_STATE":
                    return action.payload
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

    const [chorusOptions, updateChorusOptions] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "REPLACE_STATE":
                    return action.payload
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
    
    const [filterOptions, updateFilterOptions] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "REPLACE_STATE":
                    return action.payload
                case "frequency":
                    return {
                        ...state,
                        frequency: action.payload
                    }
                case "baseFrequency":
                    return {
                        ...state,
                        baseFrequency: action.payload
                    }
                case "octaves":
                    return {
                        ...state,
                        octaves: action.payload
                    }
                case "type":
                    return {
                        ...state,
                        type: action.payload
                    }
                case "depth":
                    return {
                        ...state,
                        depth: action.payload
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
            frequency: 1,
            baseFrequency: 1000,
            octaves: 5,
            type: "sine",
            depth: 0,
            wet: 0
        }
    );

    const [presetOptions, updatePresetOptions] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "REPLACE_STATE":
                    return action.payload
                case "name":
                    return {
                        ...state,
                        name: action.payload
                    }
                case "polySynthOptions":
                    return {
                        ...state,
                        polySynthOptions: action.payload
                    }
                case "delayOptions":
                    return {
                        ...state,
                        delayOptions: action.payload
                    }
                case "reverbOptions":
                    return {
                        ...state,
                        reverbOptions: action.payload
                    }
                case "chorusOptions":
                    return {
                        ...state,
                        chorusOptions: action.payload
                    }
                case "filterOptions":
                    return {
                        ...state,
                        filterOptions: action.payload
                    }
                default:
                    return state
            }
        },
        {
            name: "Default",
            polySynthOptions: polySynthOptions,
            delayOptions: delayOptions,
            reverbOptions: reverbOptions,
            chorusOptions: chorusOptions,
            filterOptions: filterOptions
        }
    )

    const [octave, setOctave] = useState(3);
    const octaveRef = useRef(3);
    const [activeVoices, setActiveVoices] = useState(polySynth.activeVoices);
    const [oscTypeValue, setOscTypeValue] = useState(0);
    const [filterTypeValue, setFilterTypeValue] = useState(0)


    // set osc type value for input range
    useEffect(()=> {
    //get osc value for range input
        const waves = ["fatsine", "fatsquare", "fatsawtooth", "fattriangle"];
        setOscTypeValue(waves.indexOf(polySynthOptions.oscillator.type))
    }, [polySynthOptions.oscillator.type])

    //set filter type value for input range
    useEffect(() => {
        const waves = ["sine", "square", "sawtooth", "triangle"];
        setFilterTypeValue(waves.indexOf(filterOptions.type))
    }, [filterOptions.type])

    // toggle visibility of controls
    const toggleVis = (e) => {
        let id = e.target.nextElementSibling.id;
        let newVis = !isVisibles[id];
        updateIsVisibles(
            {
                type: id,
                payload: newVis
            }
        )
    }


    // set up listeners for playing notes
    useEffect(() => {
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


    // set octave state
    useEffect(() => {
        polySynth.releaseAll();
        octaveRef.current = octave;
    }, [octave, ])


    // update synth with synth options
    useEffect(() => {
        polySynth.releaseAll(Tone.now());
        polySynth.set({
            volume: polySynthOptions.volume,
            detune: polySynthOptions.detune,
            oscillator: polySynthOptions.oscillator,
            envelope: polySynthOptions.envelope,
        });

        updatePresetOptions(
            {
                type: "polySynthOptions",
                payload: polySynthOptions
            }
        )
    }, [polySynthOptions, ]);

    // update delay with delay options
    useEffect(() => {
        polySynth.releaseAll(Tone.now());
        delay.set({
            delayTime: delayOptions.delayTime,
            feedback: delayOptions.feedback,
            wet: delayOptions.wet
        });
        updatePresetOptions(
            {
                type: "delayOptions",
                payload: delayOptions
            }
        )
    }, [delayOptions,]);

    // update reverb with reverb options
    useEffect(() => {
        polySynth.releaseAll(Tone.now());
        reverb.set({
            decay: reverbOptions.decay,
            wet: reverbOptions.wet
        });
        updatePresetOptions(
            {
                type: "reverbOptions",
                payload: reverbOptions
            }
        )
    }, [reverbOptions,]);

    // update chorus with chorus options
    useEffect(() => {
        polySynth.releaseAll(Tone.now());
        chorus.set({
            frequency: chorusOptions.frequency,
            delayTime: chorusOptions.delayTime,
            depth: chorusOptions.depth,
            wet: chorusOptions.wet
        });
        updatePresetOptions(
            {
                type: "chorusOptions",
                payload: chorusOptions
            }
        )
    }, [chorusOptions,]);

    // update filter with filter options
    useEffect(() => {
        polySynth.releaseAll(Tone.now());
        filter.set({
            frequency: filterOptions.frequency,
            baseFrequency: filterOptions.baseFrequency,
            octaves: filterOptions.octaves,
            depth: filterOptions.depth,
            type: filterOptions.type,
            wet: filterOptions.wet
        });
        updatePresetOptions(
            {
                type: "filterOptions",
                payload: filterOptions
            }
        )
    }, [filterOptions,]);

    // update all options when preset changes
    useEffect(() => {
        polySynth.releaseAll(Tone.now());
        updatePolySynthOptions(
            {
                type: "REPLACE_STATE",
                payload: presetOptions.polySynthOptions
            }
        )
        updateChorusOptions(
            {
                type: "REPLACE_STATE",
                payload: presetOptions.chorusOptions
            }
        )
        updateDelayOptions(
            {
                type: "REPLACE_STATE",
                payload: presetOptions.delayOptions
            }
        )
        updateFilterOptions(
            {
                type: "REPLACE_STATE",
                payload: presetOptions.filterOptions
            }
        )
        updateReverbOptions(
            {
                type: "REPLACE_STATE",
                payload: presetOptions.reverbOptions
            }
        )
    }, [presetOptions]);

    // update presetoptions when loading new preset file
    const handleNewPresetFile = (e) => {
        if (e.target.files){
            const file = e.target.files[0];
            reader.onload = (event) => {
                const data = JSON.parse(event.target.result);
                console.log(data);
                updatePresetOptions(
                    {
                        type: "REPLACE_STATE",
                        payload: data
                    }
                );
                e.target.value = "";
            };
            reader.readAsText(file);
        };
    };
    
    // update preset name when changed
    const handlePresetNameChange = (e) => {
        updatePresetOptions(
            {
                type: "name",
                payload: e.target.value
            }
        )
    }
    return (
        <div className="App">
            <div id="synth-container">
                <div className="main-container">
                    <div className="top-container">
                        <div className="main-label-container">
                            <div className="main-label">PolyRetro</div>
                            <div className="sub-label">Created by Justis Corbett</div>
                        </div>
                        <div className="presets-container"> 
                            <input  id="preset-name" className="preset-display" value={presetOptions.name} onChange={handlePresetNameChange} />
                            <div onClick={() => downloadPreset(presetOptions)} className='preset-button' id="save">
                                Save
                            </div>
                            <label className='preset-button' id="load">
                                Load
                                <input className="fully-hidden" type="file" onChange={handleNewPresetFile} />
                            </label>
                        </div>
                    </div>
                    
                    <div className="controls">
                        <div className="control-container">
                            <div className="control-label" onClick={toggleVis}>Master</div>
                            <div id="master" className= {(!isVisibles.master? 'hidden' : undefined) + " control-main-row"}>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="volume-range" onChange={handleVolumeChange} value={polySynthOptions.volume} type="range" min="-50" max="0" />
                                    </div>
                                    <div className="control-row">
                                        <div>Volume</div>
                                        <div className="display">{polySynthOptions.volume}db</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="octave-range" onChange={handleOctaveChange} value={polySynthOptions.octave} type="range" min="0" max="2" />
                                    </div>
                                    <div className="control-row">
                                        <div>Octave</div>
                                        <div className="display" id="octaveVal">{octave}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="control-container">
                            <div className="control-label" onClick={toggleVis}>OSC</div>
                            <div id="oscillator" className={(!isVisibles.oscillator? 'hidden' : undefined) + " control-main-row"}>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="osc-range" onChange={handleOscChange} value={oscTypeValue}  type="range" min="0" max="3" />
                                    </div>
                                    <div className="control-row">
                                        <div>Waveform </div>
                                        <div className="display">{polySynthOptions.oscillator.type.slice(3)}</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="count-range" onChange={handleCountChange} value={polySynthOptions.oscillator.count} type="range" min="1" max="3" step={1} />
                                    </div>
                                    <div className="control-row">
                                        <div>Count</div>
                                        <div className="display">{polySynthOptions.oscillator.count}</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="spread-range" onChange={handleSpreadChange} value={polySynthOptions.oscillator.spread} type="range" min="1" max="100" step={1} />
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
                            <div className="control-label" onClick={toggleVis}>ENV</div>
                            <div id="envelope" className={(!isVisibles.envelope? 'hidden' : undefined) + " control-main-row"}>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="attack-range" onChange={handleAttackChange} value={polySynthOptions.envelope.attack * 100} type="range" min="0" max="500" step={10} />
                                    </div>
                                    <div className="control-row">
                                        <div>Attack</div>
                                        <div className="display">{polySynthOptions.envelope.attack}s</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="decay-range" onChange={handleDecayChange} value={polySynthOptions.envelope.decay * 100} type="range" min="10" max="500" step={10} />
                                    </div>
                                    <div className="control-row">
                                        <div>Decay</div>
                                        <div className="display">{polySynthOptions.envelope.decay}s</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="sustain-range" onChange={handleSustainChange} value={polySynthOptions.envelope.sustain * 100} type="range" min="0" max="100" step={10} />
                                    </div>
                                    <div className="control-row">
                                        <div>Sustain</div>
                                        <div className="display">{polySynthOptions.envelope.sustain * 100}%</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="release-range" onChange={handleReleaseChange} value={polySynthOptions.envelope.release * 100} type="range" min="10" max="500" step={10} />
                                    </div>
                                    <div className="control-row">
                                        <div>Release</div>
                                        <div className="display">{polySynthOptions.envelope.release}s</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="control-container">
                            <div className="control-label" onClick={toggleVis}>Filter(LFO)</div>
                            <div id="filter" className={(!isVisibles.filter? 'hidden' : undefined) + " control-main-row"}>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="filter-frequency-range" onChange={handleFilterFrequencyChange} value={filterOptions.frequency * 10} type="range" min="1" max="100" step={1} />
                                    </div>
                                    <div className="control-row">
                                        <div>LFO Frequency</div>
                                        <div className="display">{filterOptions.frequency}hz</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="filter-base-frequency-range" onChange={handleFilterBaseFrequencyChange} value={filterOptions.baseFrequency} type="range" min="10" max="20000" step={10} />
                                    </div>
                                    <div className="control-row">
                                        <div>Min Cutoff</div>
                                        <div className="display">{filterOptions.baseFrequency}hz</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="filter-octaves-range" onChange={handleFilterOctavesChange} value={filterOptions.octaves} type="range" min="1" max="10" step={1} />
                                    </div>
                                    <div className="control-row">
                                        <div>Max Cutoff</div>
                                        <div className="display">+{filterOptions.octaves}oct</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="filter-depth-range" onChange={handleFilterDepthChange} value={filterOptions.depth * 10} type="range" min="0" max="10" step={1} />
                                    </div>
                                    <div className="control-row">
                                        <div>LFO Effect</div>
                                        <div className="display">{filterOptions.depth * 100}%</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="filter-type-range" onChange={handleFilterTypeChange} value={filterTypeValue} type="range" min="0" max="3" step={1} />
                                    </div>
                                    <div className="control-row">
                                        <div>LFO Wave</div>
                                        <div className="display">{filterOptions.type}</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="filter-wet-range" onChange={handleFilterWetChange} value={filterOptions.wet * 100} type="range" min="0" max="100" step={1} />
                                    </div>
                                    <div className="control-row">
                                        <div>Wet</div>
                                        <div className="display">{filterOptions.wet * 100}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="control-container">
                            <div className="control-label" onClick={toggleVis}>Delay</div>
                            <div id="delay" className={(!isVisibles.delay? 'hidden' : undefined) + " control-main-row"}>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="delay-time-range" onChange={handleDelayTimeChange} value={delayOptions.delayTime * 100} type="range" min="10" max="100" step={10} />
                                    </div>
                                    <div className="control-row">
                                        <div>Time</div>
                                        <div className="display">{delayOptions.delayTime}s</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="delay-feedback-range" onChange={handleDelayFeedbackChange} value={delayOptions.feedback * 100} type="range" min="10" max="100" step={10} />
                                    </div>
                                    <div className="control-row">
                                        <div>Feedback</div>
                                        <div className="display">{delayOptions.feedback * 100}%</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="delay-wet-range" onChange={handleDelayWetChange} value={delayOptions.wet * 100} type="range" min="0" max="100" step={1} />
                                    </div>
                                    <div className="control-row">
                                        <div>Wet</div>
                                        <div className="display">{delayOptions.wet * 100}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="control-container">
                            <div className="control-label" onClick={toggleVis}>Reverb</div>
                            <div id="reverb" className={(!isVisibles.reverb? 'hidden' : undefined) + " control-main-row"}>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="reverb-decay-range" onChange={handleReverbDecayChange} value={reverbOptions.decay * 100} type="range" min="10" max="1000" step={10} />
                                    </div>
                                    <div className="control-row">
                                        <div>Size</div>
                                        <div className="display">{reverbOptions.decay}s</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="reverb-wet-range" onChange={handleReverbWetChange} value={reverbOptions.wet * 100} type="range" min="0" max="100" step={1}/>
                                    </div>
                                    <div className="control-row">
                                        <div>Wet</div>
                                        <div className="display">{reverbOptions.wet * 100}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="control-container">
                            <div className="control-label" onClick={toggleVis}>Chorus</div>
                            <div id="chorus" className={(!isVisibles.chorus? 'hidden' : undefined) + " control-main-row"}>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="chorus-depth-range" onChange={handleChorusDepthChange} value={chorusOptions.depth * 100} type="range" min="0" max="100" step={10} />
                                    </div>
                                    <div className="control-row">
                                        <div>Depth</div>
                                        <div className="display">{chorusOptions.depth * 100}%</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="chorus-delay-range" onChange={handleChorusDelayChange} value={chorusOptions.delayTime * 10} type="range" min="1" max="50" step={1} />
                                    </div>
                                    <div className="control-row">
                                        <div>Delay</div>
                                        <div className="display">{chorusOptions.delayTime}ms</div>
                                    </div>
                                </div>
                                <div className="control-col">
                                    <div className="control-row">
                                        <input id="chorus-frequency-range" onChange={handleChorusFrequencyChange} value={chorusOptions.frequency * 10} type="range" min="1" max="100" step={1} />
                                    </div>
                                    <div className="control-row">
                                        <div>Frequency</div>
                                        <div className="display">{chorusOptions.frequency}hz</div>
                                    </div>
                                    <div className="control-row">
                                        <input id="chorus-wet-range" onChange={handleChorusWetChange} value={chorusOptions.wet * 100} type="range" min="0" max="100" step={1} />
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
