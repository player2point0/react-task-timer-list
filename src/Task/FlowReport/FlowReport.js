import React, {useState, useEffect} from 'react';
import "./flowReport.css";
import {useStoreState} from "easy-peasy";

const INPUT_SIDE_SCALE = 0.75;

export default function FlowReport({onDone, id}) {
    const screenWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    const screenHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

    const inputWidth = screenWidth * INPUT_SIDE_SCALE;
    const inputHeight = screenHeight * INPUT_SIDE_SCALE;
    const inputSideLength = inputWidth < inputHeight ? inputWidth : inputHeight;

    const inputPinDim = 50;

    const dayStat = useStoreState(state => state.dayStat.dayStat);
    const flowLen =  dayStat.flow.length;
    const previousFocus = flowLen > 0? dayStat.flow[flowLen-1].focus:0.5;
    const previousProductive = flowLen > 0? dayStat.flow[flowLen-1].productive:0.5;

    const [inputPinCoords, setInputPinCoords] = useState({
        x: "calc("+previousFocus*100+"% - "+(inputPinDim/2)+"px)",
        y: "calc("+(1-previousProductive)*100+"% - 25px)"
    });

    const flowInputOnClick = (e) => {
        const distX = (screenWidth - inputSideLength) / 2;
        const distY = (screenHeight - inputSideLength) / 2;

        const focused = (e.clientX - distX) / inputSideLength;
        const productive = 1 - (e.clientY - distY) / inputSideLength;

        const focusedRounded = focused.toFixed(2);
        const productiveRounded = productive.toFixed(2);

        const xPer = (focusedRounded * 100)+"%";
        const yPer = ((1-productiveRounded) * 100)+"%";

        setInputPinCoords({
            x: "calc("+xPer+" - "+(inputPinDim/2)+"px)",
            y: "calc("+yPer+" - "+(inputPinDim/2)+"px)"
        });

        onDone({
            id: id,
            productive: productiveRounded,
            focus: focusedRounded,
        });
    };

    return (
        <div className={"flowBody"}>
            <div
                className={"flowNA"}
                onClick={() => onDone({
                    id: id,
                    productive: "",
                    focus: "",
                })}
            >
                n/a
            </div>
            <div
                className={"flowInput"}
                onClick={flowInputOnClick}
                style={{
                    width: inputSideLength,
                    height: inputSideLength
                }}
            >
                <div
                    style={{
                        left: inputPinCoords.x,
                        top: inputPinCoords.y
                    }}
                    className={"flowInputPin"}
                    draggable
                />
                <div className={"flowInputLabelFlow flowInputLabel"}>
                    flow
                </div>
                <div className={"flowInputLabelFocused flowInputLabel"}>
                    focused
                </div>
                <div className={"flowInputLabelProductive flowInputLabel"}>
                    p<br/>r<br/>o<br/>d<br/>u<br/>c<br/>t<br/>i<br/>v<br/>e
                </div>
            </div>
        </div>
    );
}