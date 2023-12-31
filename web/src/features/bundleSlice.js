import { createSlice } from "@reduxjs/toolkit";
import * as api from "../api.js";

export const bundlesSlice = createSlice({
    name: "bundle",
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

export const setBundle = (id, value) => async (dispatch) => {
    dispatch(setOne({id, value}));
};

export const refreshBundle = () => async (dispatch, getState) => {
    const playerId = getState().player.id;
    const bundles = await api.getEntity(playerId, "bundle");
    dispatch(setAll(bundles));
}

export const { setAll, setOne } = bundlesSlice.actions;

export default bundlesSlice.reducer;
