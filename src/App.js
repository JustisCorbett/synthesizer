import * as Tone from 'tone'
import './App.css';
import React, { useState } from "react";

function App() {
    const [synth, setSynth] = useState(new Tone.Synth().toDestination());
    // const [filter, setFilter] = useState(new Tone.Filter());
    // const [reverb, setReverb] = useState(new Tone.Reverb());
    // const [delay, setDelay] = useState(new Tone.FeedbackDelay());
    // const [chorus, setChorus] = useState(new Tone.Chorus());
    const [octave, setOctave] = useState(3);

    document.documentElement.ondragstart = function(){return(false)};
    let mouse_IsDown = false;
    document.documentElement.addEventListener("mousedown", function(){mouse_IsDown = true });
    document.documentElement.addEventListener("mouseup",   function(){mouse_IsDown = false});

    const playNote = (key) => {
        synth.triggerAttack([key.dataset.note], undefined, 1)
    }

    const releaseNote = (key) => {
        synth.triggerRelease([key.dataset.note], undefined)
    }
    React.useEffect(() => {
        let keyboard = document.getElementById("keyboard");
        for(let key of keyboard.children){
            key.addEventListener("mouseover",  function(){if(mouse_IsDown) playNote(key)});
            key.addEventListener("mousedown",  function(){playNote(key)                 });
            key.addEventListener("touchstart", function(){playNote(key)                 });
            key.addEventListener("mouseleave", function(){releaseNote(key)              });
            key.addEventListener("mouseup",    function(){releaseNote(key)              });
            key.addEventListener("touchend",   function(){releaseNote(key)              });
        }
        return () => {
            let keyboard = document.getElementById("keyboard");
            for(let key of keyboard.children){
                key.removeEventListener("mouseover",  function(){if(mouse_IsDown) playNote(key)});
                key.removeEventListener("mousedown",  function(){playNote(key)                 });
                key.removeEventListener("touchstart", function(){playNote(key)                 });
                key.removeEventListener("mouseleave", function(){releaseNote(key)              });
                key.removeEventListener("mouseup",    function(){releaseNote(key)              });
                key.removeEventListener("touchend",   function(){releaseNote(key)              });
            }
        }
    }, [])
    return (
        <div className="App">
            <div id="keyboard">
                <div className="key white c" data-note="C3">
                </div>
                <div className="key black c_sharp" data-note="C#3">
                </div>
                <div className="key white d" data-note="D3">
                </div>
                <div className="key black d_sharp" data-note="D#3">
                </div>
                <div className="key white e" data-note="E3">
                </div>
                <div className="key white f" data-note="F3">
                </div>
                <div className="key black f_sharp" data-note="F#3">
                </div>
                <div className="key white g" data-note="G3">
                </div>
                <div className="key black g_sharp" data-note="G#3">
                </div>
                <div className="key white a" data-note="A3">
                </div>
                <div className="key black a_sharp" data-note="A#3">
                </div>
                <div className="key white b" data-note="B3">
                </div>
                <div className="key white c" data-note="C4">
                </div>
                <div className="key black c_sharp" data-note="C#4">
                </div>
                <div className="key white d" data-note="D4">
                </div>
                <div className="key black d_sharp" data-note="D#4">
                </div>
                <div className="key white e" data-note="E4">
                </div>
                <div className="key white f" data-note="F4">
                </div>
                <div className="key black f_sharp" data-note="F#4">
                </div>
                <div className="key white g" data-note="G4">
                </div>
                <div className="key black g_sharp" data-note="G#4">
                </div>
                <div className="key white a" data-note="A4">
                </div>
                <div className="key black a_sharp" data-note="A#4">
                </div>
                <div className="key white b" data-note="B4">
                </div>
                <div className="key white c" data-note="C5">
                </div>
                <div className="key black c_sharp" data-note="C#5">
                </div>
                <div className="key white d" data-note="D5">
                </div>
                <div className="key black d_sharp" data-note="D#5">
                </div>
                <div className="key white e" data-note="E5">
                </div>
                <div className="key white f" data-note="F5">
                </div>
                <div className="key black f_sharp" data-note="F#5">
                </div>
                <div className="key white g" data-note="G5">
                </div>
                <div className="key black g_sharp" data-note="G#5">
                </div>
                <div className="key white a" data-note="A5">
                </div>
                <div className="key black a_sharp" data-note="A#5">
                </div>
                <div className="key white b" data-note="B5">
                </div>
            </div>
        </div>
    );
}

export default App;
