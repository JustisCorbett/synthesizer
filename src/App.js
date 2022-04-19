import * as Tone from 'tone'
import './App.css';
import React from "react";

function App() {
    
    const [polySynth, setPolySynth] = React.useState(new Tone.PolySynth().toDestination());
    // const [filter, setFilter] = useState(new Tone.Filter());
    // const [reverb, setReverb] = useState(new Tone.Reverb());
    // const [delay, setDelay] = useState(new Tone.FeedbackDelay());
    // const [chorus, setChorus] = useState(new Tone.Chorus());
    const [octave, setOctave] = React.useState(3);

    const waveForm = new Tone.Waveform().toDestination();
    
    let mouseIsDown = false;

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
        console.log(key.dataset.note);
        console.log(waveForm);
        Tone.start();
        polySynth.triggerAttack(key.dataset.note, Tone.now());
        if (key.classList.contains("white")) {
            key.classList.add("white-highlighted");
        } else {
            key.classList.add("black-highlighted");
        }
    }

    const releaseNote = (key) => {
        polySynth.triggerRelease(key.dataset.note, Tone.now());
        if (key.classList.contains("white")) {
            key.classList.remove("white-highlighted");
        } else {
            key.classList.remove("black-highlighted");
        }
    }
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


    return (
        <div className="App">
            <div id="synth-container">
                <div className="controls">
                    <div className="control-container">
                        <div className="control-label">Volume</div>
                        <div className="control-row">
                        <input  id="osc1-gain" type="range" value="50"/>
                        <label htmlFor="osc1-gain">OSC 1</label>
                        </div>
                        <div className="control-row">
                        <input id="osc2-gain" type="range" value="0"/>
                        <label htmlFor="osc2-gain">OSC 2</label>
                        </div>
                    </div>
                </div>
                <div id="keyboard">
                    <div className="key white c" data-note="C3" data-key="z">
                    </div>
                    <div className="key black c_sharp" data-note="C#3" data-key="s">
                    </div>
                    <div className="key white d" data-note="D3" data-key="x">
                    </div>
                    <div className="key black d_sharp" data-note="D#3" data-key="d">
                    </div>
                    <div className="key white e" data-note="E3" data-key="c">
                    </div>
                    <div className="key white f" data-note="F3" data-key="v">
                    </div>
                    <div className="key black f_sharp" data-note="F#3" data-key="g">
                    </div>
                    <div className="key white g" data-note="G3" data-key="b">
                    </div>
                    <div className="key black g_sharp" data-note="G#3" data-key="h">
                    </div>
                    <div className="key white a" data-note="A3" data-key="n">
                    </div>
                    <div className="key black a_sharp" data-note="A#3" data-key="j">
                    </div>
                    <div className="key white b" data-note="B3" data-key="m">
                    </div>
                    <div className="key white c" data-note="C4" data-key=",">
                    </div>
                    <div className="key black c_sharp" data-note="C#4" data-key="l">
                    </div>
                    <div className="key white d" data-note="D4" data-key=".">
                    </div>
                    <div className="key black d_sharp" data-note="D#4" data-key=";">
                    </div>
                    <div className="key white e" data-note="E4" data-key="/">
                    </div>
                    <div className="key white f" data-note="F4" data-key="q">
                    </div>
                    <div className="key black f_sharp" data-note="F#4" data-key="2">
                    </div>
                    <div className="key white g" data-note="G4" data-key="w">
                    </div>
                    <div className="key black g_sharp" data-note="G#4" data-key="3">
                    </div>
                    <div className="key white a" data-note="A4" data-key="e">
                    </div>
                    <div className="key black a_sharp" data-note="A#4" data-key="4">
                    </div>
                    <div className="key white b" data-note="B4" data-key="r">
                    </div>
                    <div className="key white c" data-note="C5" data-key="t">
                    </div>
                    <div className="key black c_sharp" data-note="C#5" data-key="6">
                    </div>
                    <div className="key white d" data-note="D5" data-key="y">
                    </div>
                    <div className="key black d_sharp" data-note="D#5" data-key="7">
                    </div>
                    <div className="key white e" data-note="E5" data-key="u">
                    </div>
                    <div className="key white f" data-note="F5" data-key="i">
                    </div>
                    <div className="key black f_sharp" data-note="F#5" data-key="9">
                    </div>
                    <div className="key white g" data-note="G5" data-key="o">
                    </div>
                    <div className="key black g_sharp" data-note="G#5" data-key="0">
                    </div>
                    <div className="key white a" data-note="A5" data-key="p">
                    </div>
                    <div className="key black a_sharp" data-note="A#5" data-key="-">
                    </div>
                    <div className="key white b" data-note="B5" data-key="[">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
