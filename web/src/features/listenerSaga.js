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
        /** @type {WebSocket} */
        let socket;
        let socketPendingTimer = null;
        
        function openSocket() {
            socket = new WebSocket(`${process.env.WEBSOCKET_URL}/${playerId}`);

            socket.addEventListener("message", (event) => {
                const message = JSON.parse(event.data);
                switch(message.type) {
                    case "likes":
                        emit(setLiked(message.data));
                        break;
                    case "completed":
                        emit(setCompleted(message.data));
                        break;
                    case "gifted":
                        emit(setGifted(message.data));
                        break;
                    case "bundle":
                        emit(setBundle(message.data));
                        break;
                    case "reset":
                        switch(message.data.entity) {
                            case "likes":
                                emit(refreshLikes()); break;
                            case "completed":
                                emit(refreshCompleted()); break;
                            case "gifted":
                                emit(refreshGifted()); break;
                            case "bundle":
                                emit(refreshBundle()); break;
                        }
                        break;
                    case "version":
                        const expected_version = message.data;
                        const actual_version = process.env.CDNV;
                        // console.log("Server sxpects version", expected_version, "and I am version", actual_version);
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
                        break;
                    
                }
            });
    
            // socket.addEventListener("error", onClose);
            socket.addEventListener("close", onClose);
        }

        function onClose(event) {
            console.log("Closed",event);
            socket = null;
    
            //reconnect after a few seconds
            socketPendingTimer = setTimeout(() => {
                openSocket();
            }, 1000)
        }

        openSocket();

        return () => {
            if(socket) {
                socket.close();
                socket = null;
            }
            if(socketPendingTimer) {
                clearTimeout(socketPendingTimer);
                socketPendingTimer = null;
            }
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


