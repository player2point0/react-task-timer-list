import React, {useState} from 'react';
import "../../css/flowReport.css";


const INPUT_SIDE_SCALE = 0.75;


export default function ({onDone, id}) {
    //todo when open prevent scrolling to stop drifting placements
    //todo recalculate the values when the window is scaled

    const screenWidth = document.documentElement.clientWidth
        || document.body.clientWidth;
    const screenHeight = document.documentElement.clientHeight
        || document.body.clientHeight;

    const inputWidth = screenWidth * INPUT_SIDE_SCALE;
    const inputHeight = screenHeight * INPUT_SIDE_SCALE;
    const inputSideLength = inputWidth < inputHeight ? inputWidth : inputHeight;

    const inputPinDim = 50;

    const [inputPinCoords, setInputPinCoords] = useState({
        x: screenWidth / 2 - inputPinDim / 2,
        y: screenHeight / 2 - inputPinDim / 2
    });

    //todo add the option to leave this blank for tasks where this would not apply e.g. lunch
    const flowInputOnClick = (e) => {
        const distX = (screenWidth - inputSideLength) / 2;
        const distY = (screenHeight - inputSideLength) / 2;

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
                <div className={"flowInputCorner"}>
                    <div className={"flowInputLabelFocused flowInputLabel"}>
                        distracted
                    </div>
                </div>
                <div className={"flowInputCorner"}>
                    <div className={"flowInputLabelProductive flowInputLabel"}>
                        productive
                    </div>
                    <div className={"flowInputLabelFlow flowInputLabel"}>
                        flow
                    </div>
                </div>
                <div className={"flowInputCorner"}>
                    <div className={"flowInputLabelNotProductive flowInputLabel"}>
                        not productive
                    </div>
                </div>
                <div className={"flowInputCorner"}>
                    <div className={"flowInputLabelDistracted flowInputLabel"}>
                        focused
                    </div>
                </div>
            </div>
        </div>
    );
}