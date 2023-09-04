import { eventChannel, END } from "redux-saga";
import { put, call, take, takeEvery } from "redux-saga/effects";

import {setPlayerId} from "./playerSlice.js";
import { setAll as setLiked, refreshLikes} from "./likesSlice.js";
import { setAll as setCompleted, refreshCompleted} from "./completedSlice.js";
import { setAll as setGifted, refreshGifted} from "./giftedSlice.js";
import { setAll as setBundle, refreshBundle} from "./bundleSlice.js";

/** @type {import("redux-saga").EventChannel} */
let listener = null;
let done_first_fetch = false;

function* createListener(playerId) {
    return eventChannel((emit) => {
        const listener = new EventSource(`${process.env.API_ROOT}/listen/${playerId}`);

        listener.addEventListener("likes", (event) => {
            const data = JSON.parse(event.data);
            emit(setLiked(data));
        });
        listener.addEventListener("completed", (event) => {
            const data = JSON.parse(event.data);
            emit(setCompleted(data));
        })
        listener.addEventListener("gifted", (event) => {
            const data = JSON.parse(event.data);
            emit(setGifted(data));
        })
        listener.addEventListener("bundle", (event) => {
            const data = JSON.parse(event.data);
            emit(setBundle(data));
        })
        listener.addEventListener("reset", (event) => {
            const data = JSON.parse(event.data);
            switch(data.entity) {
                case "likes":
                    emit(refreshLikes()); break;
                case "completed":
                    emit(refreshCompleted()); break;
                case "gifted":
                    emit(refreshGifted()); break;
                case "bundle":
                    emit(refreshBundle()); break;
            }
        })
        listener.addEventListener("version", (event) => {
            const expected_version = event.data;
            const actual_version = process.env.CDNV;
            if(actual_version !== expected_version) {
                setTimeout(() => {
                    window.location = window.location; //refresh
                }, 120_000); // wait a while for the server to stabilize
            }

            if(!done_first_fetch || actual_version === expected_version) {
                emit(refreshLikes());
                emit(refreshCompleted());
                emit(refreshGifted());
                emit(refreshBundle());
                done_first_fetch = true;
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

    while(true) {
        const action = yield take(listener);
        yield put(action);
    }
}

export function* watchPlayerId() {
    yield takeEvery(setPlayerId.type, setUpListener);
}


