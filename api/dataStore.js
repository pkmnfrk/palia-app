import { DateTime } from "luxon";
import config from "config";

import * as dynamoDbBackend from "./backends/dynamodb.js";
import * as memoryBackend from "./backends/memory.js";

function chooseBackend() {
    switch(config.get("backend")) {
        case "dynamodb":
            return dynamoDbBackend;
        case "memory":
            return memoryBackend;
        default:
            throw new Error("Undefined backend");
    }
}

const backend = chooseBackend();

const fakeOffset = (() => {
    return 0;
    // const realNow = DateTime.now().setZone("America/New_York");
    // const pretendTime = realNow.set({ hour: 23, minute: 59, second: 0, millisecond: 0});
    // return pretendTime.diff(realNow);
})();

const listeners = [];

let likes_cache = null;
let likes_cache_expiry = nextWeeklyRolloverDate();

let player_cache = {
    gifted: {
        players: {},
        expiry: nextDailyRolloverDate(),
    },
    completed: {
        players: {},
        expiry: nextWeeklyRolloverDate(),
    },
    bundle: {
        players: {},
    }
};


function nextDailyRolloverDate() {
    return backend.getNow().plus({ days: 1}).startOf("day");
}

function nextWeeklyRolloverDate() {
    return backend.getNow().plus({ weeks: 1 }).startOf("week");
}

function getToday() {
    return backend.getNow().startOf("day").toISODate();
}

function getWeek() {
    return backend.getNow().startOf("week").toISODate();
}

function checkCacheExpiries() {
    const now = backend.getNow();
    if(likes_cache_expiry < now) {
        likes_cache = null;
        likes_cache_expiry = nextWeeklyRolloverDate();

        sendEvent(null, "reset", {
            entity: "likes"
        });
    }

    for(const [entity, cache] of Object.entries(player_cache)) {
        if(cache.expiry && cache.expiry < now) {
            cache.players = {};
            cache.expiry = expiryFor(entity);

            sendEvent(null, "reset", {
                entity
            });
        }
    }
}

function expiryFor(entity) {
    switch(entity) {
        case "likes":
        case "completed":
            return nextWeeklyRolloverDate();
        case "gifted":
            return nextDailyRolloverDate();
        case "bundle":
            return backend.getNow().plus({year: 5});
        default:
            throw new Error("Unknown entity type " + entity);
        
    }
}

function keyFor(entity, player) {
    switch(entity) {
        case "completed":
            return `${entity}-${player}-${getWeek()}`;
        case "gifted":
            return `${entity}-${player}-${getToday()}`;
        case "bundle":
            return `${entity}-${player}`;
        default:
            throw new Error("Unknown entity type " + entity);
        
    }
}

export async function setLike(id, value) {
    console.log("saving likes", id, value);

    const key = `root-likes-${getWeek()}`;

    await backend.update(key, id, value, likes_cache_expiry);

    await getLikes();

    likes_cache[id] = value;

    sendEvent(null, "likes", likes_cache);

    console.log("Saved");
}

export async function getLikes() {
    checkCacheExpiries();

    if(!likes_cache) {
        const key = `root-likes-${getWeek()}`;
        const ret = await backend.get(key);

        delete ret.id;
        delete ret.expiry;

        likes_cache = ret;
    }

    return likes_cache;
}

export async function getEntity(player, entity) {
    if(!player_cache[entity].players[player]) {

        const key = keyFor(entity, player);
        const ret = await backend.get(key);

        delete ret.id;
        delete ret.expiry;
        player_cache[entity].players[player] = ret;
    }

    return player_cache[entity].players[player];
}

/**
 * 
 * @param {*} player 
 * @param {"completed"|"gifted"|"bundle"} entity 
 * @param {*} id 
 * @param {*} value 
 */
export async function setEntity(player, entity, id, value) {
    console.log("SET", player, "'s", entity, "[", id, "] to", value);
    const key = keyFor(entity, player);
    const expiry = expiryFor(entity);

    await backend.update(key, id, value, expiry);

    const completed = await getEntity(player, entity);

    completed[id] = value;

    sendEvent(player, entity, completed);
}


function sendEvent(player, type, data) {
    const event = {
        type,
        data,
    };
    for(const listener of listeners) {
        if(player && listener.player !== player) {
            continue;
        }

        listener(event);
    }
    
}

export function addListener(player, cb) {
    cb.player = player;
    listeners.push(cb);
    return () => {
        const ix = listeners.indexOf(cb);
        if(ix !== -1) {
            listeners.splice(ix, 1);
        }
    };
}

function handleExpiry() {
    setInterval(checkCacheExpiries, 60_000).unref();
}

handleExpiry();

