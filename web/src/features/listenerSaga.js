import { eventChannel, END } from "redux-saga";
import { put, call, take, takeEvery } from "redux-saga/effects";

import {setPlayerId} from "./playerSlice.js";
import { setAll as setLiked, refreshLikes} from "./likesSlice.js";
import { setAll as setCompleted, refreshCompleted} from "./completedSlice.js";
import { setAll as setGifted, refreshGifted} from "./giftedSlice.js";

/** @type {import("redux-saga").EventChannel} */
let listener = null; 

function* createListener(playerId) {
    return eventChannel((emit) => {
        const listener = new EventSource(`${process.env.API_ROOT}/listen/${playerId}`);

        function refresh(full) {
            console.log("current player id", playerId);
            emit(refreshLikes());
            if(full) {
              emit(refreshCompleted());
              emit(refreshGifted());
            }
          }

        listener.addEventListener("likes", (event) => {
            const data = JSON.parse(event.data);
            emit(setLiked(data));
        });
        listener.addEventListener("complete", (event) => {
            const data = JSON.parse(event.data);
            emit(setCompleted(data));
        })
        listener.addEventListener("gifted", (event) => {
            const data = JSON.parse(event.data);
            emit(setGifted(data));
        })
        listener.addEventListener("weekly_reset", (event) => {
            refresh(true);
        })
        listener.addEventListener("daily_reset", (event) => {
            refresh(true);
        })
        listener.addEventListener("version", (event) => {
            const expected_version = event.data;
            const actual_version = process.env.CDNV;
            if(actual_version !== expected_version) {
                setTimeout(() => {
                    window.location = window.location; //refresh
                }, 120_000); // wait a while for the server to stabilize
            }
        });

        return () => {
            listener.close();
        }
    });
}

function* setUpListener(action) {
    if(listener) {
        listener.close();
    }

    listener = yield call(createListener, action.payload);
    yield put(refreshLikes())
    yield put(refreshCompleted())
    yield put(refreshGifted());

    while(true) {
        const action = yield take(listener);
        yield put(action);
    }
}

export function* watchPlayerId() {
    yield takeEvery(setPlayerId.type, setUpListener);
}


