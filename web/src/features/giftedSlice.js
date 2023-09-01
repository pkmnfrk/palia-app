import { createSlice } from "@reduxjs/toolkit";
import * as dataStore from "../dataStore.js";

export const giftedSlice = createSlice({
    name: "gifted",
    initialState: {},
    reducers: {
        setAll(state, action) {
            return action.payload;
        },
        setOne(state, action) {
            state[action.payload.id] = action.payload.value;
        }
    }
});

export const setGifted = (id, value) => async (dispatch, getState) => {
    dispatch(setOne({id, value}));
    const playerId = getState().player.id;
    await dataStore.setGifted(playerId, id, value);
};

export const refreshGifted = () => async (dispatch, getState) => {
    const playerId = getState().player.id;
    const gifted = await dataStore.getGifted(playerId);
    dispatch(setAll(gifted));
};

export const { setAll, setOne } = giftedSlice.actions;

export default giftedSlice.reducer;
