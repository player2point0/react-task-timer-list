import {action,} from "easy-peasy";
import {firebaseSaveUserData} from "../../Firebase/FirebaseController";

export const addTag = action((state, tag) => {
    if(!state.tags.includes(tag)){
        state.tags.push(tag);
        firebaseSaveUserData(state);
    }
});