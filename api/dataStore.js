
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DateTime } from "luxon";
import config from "config";

const fakeOffset = (() => {
    return 0;
    // const realNow = DateTime.now().setZone("America/New_York");
    // const pretendTime = realNow.set({ hour: 23, minute: 59, second: 0, millisecond: 0});
    // return pretendTime.diff(realNow);
})();

const table = config.get("table");
const dynamodb = DynamoDBDocument.from(new DynamoDBClient());

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
    bundles: {
        players: {},
    }
};

function getNow() {
    return DateTime.now().setZone("America/New_York").plus({milliseconds: fakeOffset});
}

function nextDailyRolloverDate() {
    return getNow().plus({ days: 1}).startOf("day");
}

function nextWeeklyRolloverDate() {
    return getNow().plus({ weeks: 1 }).startOf("week");
}

function getToday() {
    return getNow().startOf("day").toISODate();
}

function getWeek() {
    return getNow().startOf("week").toISODate();
}

function checkCacheExpiries() {
    const now = getNow();
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
            return getNow().plus({year: 1});
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
    await dynamodb.update({
        Key: {id: key},
        TableName: table,
        UpdateExpression: "set #id = :value, expiry = :expiry",
        ExpressionAttributeValues: {
            ":value": value,
            ":expiry": likes_cache_expiry.toUnixInteger()
        },
        ExpressionAttributeNames: {
            "#id": id
        },
    })

    await getLikes();

    likes_cache[id] = value;

    sendEvent(null, "likes", likes_cache);

    console.log("Saved");
}

export async function getLikes() {
    checkCacheExpiries();

    if(!likes_cache) {
        const key = `root-likes-${getWeek()}`;
        const item = await dynamodb.get({
            TableName: table,
            Key: {id: key},
        });

        let ret = item.Item;

        if(ret && ret.expiry < getNow().toUnixInteger()) {
            ret = null;
        }

        if(!ret) {
            ret = {};
        }

        delete ret.id;
        delete ret.expiry;

        likes_cache = ret;
    }

    return likes_cache;
}

export async function getEntity(player, entity) {
    if(!player_cache[entity].players[player]) {

        const key = keyFor(entity, player);
        const item = await dynamodb.get({
            TableName: table,
            Key: {id: key},
        });

        let ret = item.Item;

        if(ret && ret.expiry < getNow().toUnixInteger()) {
            ret = null;
        }

        if(!ret) {
            ret = {};
        }

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

    await dynamodb.update({
        Key: {id: key},
        TableName: table,
        UpdateExpression: "set #id = :value, expiry = :expiry",
        ExpressionAttributeValues: {
            ":value": value,
            ":expiry": expiry.toUnixInteger(),
        },
        ExpressionAttributeNames: {
            "#id": id
        },
    })

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

