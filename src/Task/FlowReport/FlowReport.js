import React, {useState, useEffect} from 'react';
import "./flowReport.css";


const INPUT_SIDE_SCALE = 0.75;


export default function FlowReport({onDone, id}) {
    //todo when open prevent scrolling to stop drifting placements
    //todo recalculate the values when the window is scaled

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

    const [inputPinCoords, setInputPinCoords] = useState({
        x: screenWidth / 2 - inputPinDim / 2,
        y: screenHeight / 2 - inputPinDim / 2
    });


    React.useEffect(() => {
        function handleResize() {
            const inputWidth = screenWidth * INPUT_SIDE_SCALE;
            const inputHeight = screenHeight * INPUT_SIDE_SCALE;
            const inputSideLength = inputWidth < inputHeight ? inputWidth : inputHeight;

            const inputPinDim = 50;

            //todo maybe change to percentge to fix sizing
            setInputPinCoords({
                x: screenWidth / 2 - inputPinDim / 2,
                y: screenHeight / 2 - inputPinDim / 2
            });
        }

        window.addEventListener('onchange', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    });

    //todo add the option to leave this blank for tasks where this would not apply e.g. lunch
    const flowInputOnClick = (e) => {
        const distX = (screenWidth - inputSideLength) / 2;
        const distY = (screenHeight - inputSideLength) / 2 - document.body.scrollHeight;

        const focused = (e.clientX - distX) / inputSideLength;
        const productive = 1 - (e.clientY - distY) / inputSideLength;

        const focusedRounded = focused.toFixed(2);
        const productiveRounded = productive.toFixed(2);

        setInputPinCoords({
            x: e.clientX - inputPinDim / 2,
            y: e.clientY - inputPinDim / 2
        });

        onDone(id, focusedRounded, productiveRounded);
    };

    return (
        <div className={"flowBody"}>
            <div
                className={"flowNA"}
                onClick={() => onDone(id, "na", "na")}
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