import React, {useState,} from 'react';
import "./flowReport.css";
import {useStoreState} from "easy-peasy";

export default function FlowReport({onDone, id}) {

    const dayStat = useStoreState(state => state.dayStat.dayStat);
    const flowLen = dayStat.flow.length;
    const previousFocus = flowLen > 0 ? dayStat.flow[flowLen - 1].focus : 0.5;
    const previousProductive = flowLen > 0 ? dayStat.flow[flowLen - 1].productive : 0.5;
    const [focus, setFocus] = useState(previousFocus*100);
    const [productive, setProductive] = useState(previousProductive*100);

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