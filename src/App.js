import * as Tone from 'tone'
import './App.css';
import React, { useState, useEffect } from "react";

function App() {
    const [mouseIsDown, setMouseisDown] = useState(false);
    const [synth, setSynth] = useState(new Tone.Synth().toDestination());
    // const [filter, setFilter] = useState(new Tone.Filter());
    // const [reverb, setReverb] = useState(new Tone.Reverb());
    // const [delay, setDelay] = useState(new Tone.FeedbackDelay());
    // const [chorus, setChorus] = useState(new Tone.Chorus());
    const [octave, setOctave] = useState(3);

    
    const handleMouseDown = (bool) => {
        setMouseisDown(bool);
    }

    const playNote = (note) => {
        console.log(note);
        Tone.start();
        synth.triggerAttack(note, Tone.now());
    }

    const releaseNote = (note) => {
        synth.triggerRelease(Tone.now());
    }
    React.useEffect(() => {
        document.documentElement.ondragstart = function(){return(false)};
        document.documentElement.addEventListener("mousedown", handleMouseDown(true));
        document.documentElement.addEventListener("mouseup",   handleMouseDown(false));
        let keyboard = document.getElementById("keyboard");
        for(let key of keyboard.children){
            key.addEventListener("mouseover",  function(){if(mouseIsDown) playNote(key.dataset.note)});
            key.addEventListener("mousedown",  function(){playNote(key.dataset.note)                 });
            key.addEventListener("touchstart", function(){playNote(key.dataset.note)                 });
            key.addEventListener("mouseleave", function(){releaseNote(key.dataset.note)              });
            key.addEventListener("mouseup",    function(){releaseNote(key.dataset.note)              });
            key.addEventListener("touchend",   function(){releaseNote(key.dataset.note)              });
        }
        return () => {
            let keyboard = document.getElementById("keyboard");
            for(let key of keyboard.children){
                key.removeEventListener("mouseover",  function(){if(mouseIsDown) playNote(key.dataset.note)});
                key.removeEventListener("mousedown",  function(){playNote(key.dataset.note)                 });
                key.removeEventListener("touchstart", function(){playNote(key.dataset.note)                 });
                key.removeEventListener("mouseleave", function(){releaseNote(key.dataset.note)              });
                key.removeEventListener("mouseup",    function(){releaseNote(key.dataset.note)              });
                key.removeEventListener("touchend",   function(){releaseNote(key.dataset.note)              });
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
