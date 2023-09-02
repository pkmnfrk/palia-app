import { createSlice } from "@reduxjs/toolkit";

export const playerSlice = createSlice({
    name: "player",
    initialState: {
        id: null,
    },
    reducers: {
        setPlayerId(state, action) {
            state.id = action.payload;
        },
        setBundleSpoilers(state, action) {
            state.bundle_spoilers = action.payload;
        }
    }
});

export const { setPlayerId, setBundleSpoilers } = playerSlice.actions;

export default playerSlice.reducer;
