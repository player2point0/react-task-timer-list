import React, {useState,} from 'react';
import "./flowReport.css";

export default function FlowReport({onDone, id}) {

    const [focus, setFocus] = useState(50);
    const [productive, setProductive] = useState(50);

    const focusStates = ["nah", "kinda", "yep"];
    const productiveStates = ["nah", "kinda", "yep"];

    const mapValue = (val, in_min, in_max, out_min, out_max) => {
        return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    };

    const getSliderLabel = (sliderValue, labelStates) => {
        const index = Math.floor(mapValue(sliderValue, 0, 101, 0, labelStates.length));
        return labelStates[index];
    };

    //todo add flow zone indicator when high focus and producitvity

    return (
        <div className={"flowBody"}>
            <div>
                focus: {getSliderLabel(focus, focusStates)}
            </div>
            <input
                type="range"
                min="0"
                max="100"
                className="flowSlider"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
            />
            <div>
                productive: {getSliderLabel(productive, productiveStates)}
            </div>
            <input
                type="range"
                min="0"
                max="100"
                className="flowSlider"
                value={productive}
                onChange={(e) => setProductive(e.target.value)}
            />
            <div
                className={"flowButtons"}
            >
                <div
                    className={"naButton"}
                    onClick={() => onDone({
                        id: id,
                        productive: "",
                        focus: "",
                    })}
                >
                    n/a
                </div>
                <div
                    className={"doneButton"}
                    onClick={() => onDone({
                        id: id,
                        productive: (productive/100).toFixed(2),
                        focus: (focus/100).toFixed(2),
                    })}
                >
                    done
                </div>
            </div>
        </div>
);
}