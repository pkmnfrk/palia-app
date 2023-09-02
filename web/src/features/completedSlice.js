import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api.js";

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
    await api.setEntity(playerId, api.ENTITY_COMPLETED, id, value);
};

export const refreshCompleted = () => async (dispatch, getState) => {
    const playerId = getState().player.id;
    const completed = await api.getEntity(playerId, api.ENTITY_COMPLETED);
    dispatch(setAll(completed));
};

export const { setAll, setOne } = completedSlice.actions;

export default completedSlice.reducer;
