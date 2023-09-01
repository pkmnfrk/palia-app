import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as dataStore from "../dataStore.js";

export const completedSlice = createSlice({
    name: "completed",
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

export const setCompleted = (id, value) => async (dispatch, getState) => {
    dispatch(setOne({id, value}));
    const playerId = getState().player.id;
    await dataStore.setComplete(playerId, id, value);
};

export const refreshCompleted = () => async (dispatch, getState) => {
    const playerId = getState().player.id;
    const completed = await dataStore.getCompleted(playerId);
    dispatch(setAll(completed));
};

export const { setAll, setOne } = completedSlice.actions;

export default completedSlice.reducer;
