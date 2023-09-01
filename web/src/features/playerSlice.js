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
    }
});

export const { setPlayerId } = playerSlice.actions;

export default playerSlice.reducer;
