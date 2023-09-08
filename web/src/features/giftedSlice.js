import { createSlice } from "@reduxjs/toolkit";
import * as api from "../api.js";

export const giftedSlice = createSlice({
    name: "gifted",
    initialState: {},
    reducers: {
        setAll(state, action) {
            const ret = action.payload;
            for(const key of Object.keys(ret)) {
                ret[key] = fixState(ret[key]);
            }
            return ret;
        },
        setOne(state, action) {
            state[action.payload.id] = action.payload.value;
        },
    }
});

export const setGifted = (id, value) => async (dispatch) => {
    dispatch(setOne({id, value}));
};

export const refreshGifted = () => async (dispatch, getState) => {
    const playerId = getState().player.id;
    const gifted = await api.getEntity(playerId, api.ENTITY_GIFTED);
    dispatch(setAll(gifted));
};

export const giveGift = (id) => async (dispatch, getState) => {
    console.log("Giving gift to", id);
    const giftState = {
        ...getState().gifted[id] ?? {},
        gifted: true,
        targetted: false,
    };
    dispatch(setGifted(id, giftState));

}

export const { setAll, setOne } = giftedSlice.actions;

export default giftedSlice.reducer;

function fixState(state) {
    if(state === true) {
        return {
            gifted: true,
            targetted: false,
        };
    } else if(state === false) {
        return {
            gifted: false,
            targetted: false,
        };
    } else if(state == "target") {
        return {
            gifted: false,
            targetted: true,
        };
    } else if(!state) {
        return {
            gifted: false,
            targetted: false,
        }
    }

    return state;
}