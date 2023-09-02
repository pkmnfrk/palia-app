import {configureStore} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import likesReducer from "./features/likesSlice.js";
import completedReducer from "./features/completedSlice.js";
import giftedReducer from "./features/giftedSlice.js";
import playerReducer from "./features/playerSlice.js";
import bundleReducer from "./features/bundleSlice.js";
import {watchPlayerId} from "./features/listenerSaga.js";

const saga = createSagaMiddleware();

export default configureStore({
    reducer: {
        player: playerReducer,
        likes: likesReducer,
        gifted: giftedReducer,
        completed: completedReducer,
        bundle: bundleReducer,
    },
    middleware: (defaultMiddleware) => [
        ...defaultMiddleware(),
        saga,
    ],
});

saga.run(watchPlayerId);
