import { createSlice } from "@reduxjs/toolkit";
import * as api from "../api.js";

export const likesSlice = createSlice({
    name: "likes",
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

export const setLike = (id, value) => async (dispatch) => {
    dispatch(setOne({id, value}));
    await api.setLike(id, value);
};

export const refreshLikes = () => async (dispatch) => {
    const likes = await api.getLikes();
    dispatch(setAll(likes));
}

export const { setAll, setOne } = likesSlice.actions;

export default likesSlice.reducer;
