import { eventChannel, END } from "redux-saga";
import { put, call, take, takeEvery, actionChannel, fork, delay, select } from "redux-saga/effects";

import {setPlayerId} from "./playerSlice.js";
import { setOne as setOneLiked, setAll as setLiked, refreshLikes} from "./likesSlice.js";
import { setOne as setOneCompleted, setAll as setCompleted, refreshCompleted} from "./completedSlice.js";
import { setOne as setOneGifted, setAll as setGifted, refreshGifted} from "./giftedSlice.js";
import { setOne as setOneBundle, setAll as setBundle, refreshBundle} from "./bundleSlice.js";
import * as api from "../api.js";

/** @type {import("redux-saga").EventChannel} */
let listener = null;
let done_first_fetch = false;

let socket = null;

function createListener(playerId) {
    return eventChannel((emit) => {
        /** @type {WebSocket} */
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
                        emit({
                            type: "REFRESH",
                            payload: [message.data.entity],
                        });
                        break;
                    case "version":
                        const expected_version = message.data;
                        const actual_version = process.env.CDNV;
                        if(actual_version !== expected_version) {
                            setTimeout(() => {
                                window.location = window.location; //refresh
                            }, 120_000); // wait a while for the server to stabilize
                        }
                        break;
                    
                }
            });
    
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
        break;
    }
}

function * setEntity(data, entity) {
    const playerId = yield select(state => state.player.id);
    if(socket) {
        socket.send(JSON.stringify({
            type: "setEntity",
            data: {
                entity,
                ...data,
            }
        }));
    } else {
        if(entity === "like") {
            yield call(api.setLike, data.id, data.value);
        } else {
            yield call(api.setEntity, playerId, entity, data.id, data.value);
        }
    }
}

function * saveData() {
    const requestChannel = yield actionChannel([
        setOneLiked.type,
        setOneCompleted.type,
        setOneGifted.type,
        setOneBundle.type,
    ]);
    while(true) {
        const action = yield take(requestChannel);
        switch(action.type) {
            case setOneLiked.type:
                yield * setEntity(action.payload, api.ENTITY_LIKES);
                break;
            case setOneCompleted.type:
                yield * setEntity(action.payload, api.ENTITY_COMPLETED);
                break;
            case setOneGifted.type:
                yield * setEntity(action.payload, api.ENTITY_GIFTED);
                break;
            case setOneBundle.type:
                yield * setEntity(action.payload, api.ENTITY_BUNDLE);
                break;
            
        }
    }
}

export function* watchPlayerId() {
    yield takeEvery(setPlayerId.type, setUpListener);
}

export function* watchDataChanges() {
    yield fork(saveData);
}


