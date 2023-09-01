import {configureStore} from "@reduxjs/toolkit";
import likesReducer from "./features/likesSlice.js";
import completedReducer from "./features/completedSlice.js";
import giftedReducer from "./features/giftedSlice.js";
import playerReducer from "./features/playerSlice.js";

export default configureStore({
    reducer: {
        player: playerReducer,
        likes: likesReducer,
        gifted: giftedReducer,
        completed: completedReducer,
    }
})