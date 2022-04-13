import * as Tone from 'tone'
import './App.css';
import React from "react";

function App() {
    
    const [synth, setSynth] = React.useState(new Tone.Synth().toDestination());
    // const [filter, setFilter] = useState(new Tone.Filter());
    // const [reverb, setReverb] = useState(new Tone.Reverb());
    // const [delay, setDelay] = useState(new Tone.FeedbackDelay());
    // const [chorus, setChorus] = useState(new Tone.Chorus());
    const [octave, setOctave] = React.useState(3);

    let mouseIsDown = false;
    const handleMouseDown = (bool) => {
        mouseIsDown = bool;
    }

    const playNote = (key) => {
        console.log(key.dataset.note);
        Tone.start();
        synth.triggerAttack(key.dataset.note, Tone.now());
        if (key.classList.contains("white")) {
            key.classList.add("white-highlighted");
        } else {
            key.classList.add("black-highlighted");
        }
    }

    const releaseNote = (key) => {
        synth.triggerRelease(Tone.now());
        if (key.classList.contains("white")) {
            key.classList.remove("white-highlighted");
        } else {
            key.classList.remove("black-highlighted");
        }
    }
    React.useEffect(() => {
        let keyboard = document.getElementById("keyboard");
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
            <div className="controls">
                
            </div>
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
